import asyncio
import socket
import sys
from pathlib import Path
from unittest.mock import patch

import httpx
import pytest

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'src'))
from life.network import PublicHTTPTransport, resolved_address


def test_transport_pins_address_and_preserves_tls_identity():
    seen = []

    async def handler(request):
        seen.append(request)
        return httpx.Response(200, content=b'ok')

    async def run():
        transport = PublicHTTPTransport()
        await transport.inner.aclose()
        transport.inner = httpx.MockTransport(handler)
        with patch('life.network.resolved_address', return_value='93.184.216.34'):
            async with httpx.AsyncClient(transport=transport) as client:
                assert (await client.get('https://feed.example/rss')).text == 'ok'

    asyncio.run(run())
    assert seen[0].url.host == '93.184.216.34'
    assert seen[0].headers['host'] == 'feed.example'
    assert seen[0].extensions['sni_hostname'] == 'feed.example'


def test_rebound_host_is_blocked_at_connection_time():
    infos = [(socket.AF_INET, socket.SOCK_STREAM, 6, '', ('127.0.0.1', 80))]
    with patch('socket.getaddrinfo', return_value=infos):
        with pytest.raises(ValueError, match='non-public'):
            resolved_address('public-looking.example', 80)
