package authctx

// Who has the gateway already established the caller to be?
//
// Two middlewares need this answer and they are not adjacent: pairing
// authenticates (loopback peer, device token, or a session cookie), and the
// plugin guard decides whether an API that demands a plugin identity may be
// reached without one. The pairing layer runs first and out of package, so the
// verdict travels in the request context.
//
// Keeping the key in its own tiny package is the point: neither side imports the
// other, and nothing re-derives identity from headers, which is the mistake that
// made the plugin permission model optional before.

import "context"

type key struct{}

// WithSession marks the request as already authenticated by the pairing layer.
// The value is the method that authenticated it, kept for logs.
func WithSession(ctx context.Context, method string) context.Context {
	return context.WithValue(ctx, key{}, method)
}

// Session returns the authentication method, or "" when no layer established one.
func Session(ctx context.Context) string {
	method, _ := ctx.Value(key{}).(string)
	return method
}

// Authenticated reports whether some layer already vouched for this request.
func Authenticated(ctx context.Context) bool {
	return Session(ctx) != ""
}
