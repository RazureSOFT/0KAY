"""Outbound transports: validate the address that is actually connected to."""
from __future__ import annotations

import asyncio
import ipaddress
import os
import socket
import ssl
import imaplib
import smtplib

import httpx


def resolved_address(host: str, port: int, allow_env: str = "") -> str:
    addresses = socket.getaddrinfo(host, port, type=socket.SOCK_STREAM)
    if not addresses:
        raise ValueError("host resolved to no addresses")
    allow_private = os.getenv(allow_env, "").lower().strip() in ("1", "true", "yes", "on") if allow_env else False
    for info in addresses:
        if not allow_private and not ipaddress.ip_address(info[4][0]).is_global:
            raise ValueError("blocked non-public address")
    return addresses[0][4][0]


class PublicHTTPTransport(httpx.AsyncBaseTransport):
    """No ambient proxies; keep HTTP Host and TLS SNI while dialing a pinned IP."""

    def __init__(self, allow_env: str = ""):
        self.allow_env = allow_env
        self.inner = httpx.AsyncHTTPTransport()

    async def handle_async_request(self, request: httpx.Request) -> httpx.Response:
        if request.url.scheme not in ("http", "https"):
            raise ValueError("only http/https URLs are allowed")
        host = request.url.host
        port = request.url.port or (443 if request.url.scheme == "https" else 80)
        address = await asyncio.to_thread(resolved_address, host, port, self.allow_env)
        headers = request.headers.copy()
        headers["Host"] = request.url.netloc.decode("ascii")
        extensions = {**request.extensions, "sni_hostname": host}
        pinned = httpx.Request(request.method, request.url.copy_with(host=address),
                               headers=headers, stream=request.stream, extensions=extensions)
        return await self.inner.handle_async_request(pinned)

    async def aclose(self):
        await self.inner.aclose()


def mail_socket(host: str, port: int, timeout, source_address=None):
    address = resolved_address(host, port, "LIFE_MAIL_ALLOW_PRIVATE")
    return socket.create_connection((address, port), timeout, source_address)


class SecureIMAP(imaplib.IMAP4_SSL):
    def _create_socket(self, timeout):
        sock = mail_socket(self.host, self.port, timeout)
        try:
            return self.ssl_context.wrap_socket(sock, server_hostname=self.host)
        except BaseException:
            sock.close()
            raise


class StartTLSIMAP(imaplib.IMAP4):
    def _create_socket(self, timeout):
        return mail_socket(self.host, self.port, timeout)


class SecureSMTP(smtplib.SMTP_SSL):
    def _get_socket(self, host, port, timeout):
        sock = mail_socket(host, port, timeout, self.source_address)
        try:
            return self.context.wrap_socket(sock, server_hostname=host)
        except BaseException:
            sock.close()
            raise


class StartTLSSMTP(smtplib.SMTP):
    def _get_socket(self, host, port, timeout):
        return mail_socket(host, port, timeout, self.source_address)
