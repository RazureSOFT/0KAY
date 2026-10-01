package gateway

import (
	"io"
	"net/http"
)

// handleStdioProvider forwards an OpenAI-compatible request to a provider
// plugin hosted as a stdio child process, so the plugin needs no listening
// port. Core registers the provider's base_url as this route plus the
// plugin-declared sub-path.
//
//	/api/stdio-provider/{id}/{path...}
func (g *Gateway) handleStdioProvider(w http.ResponseWriter, r *http.Request) {
	id := r.PathValue("id")
	rest := r.PathValue("path")
	if g.stdio == nil || id == "" {
		notFound(w, "stdio provider not found")
		return
	}
	var body []byte
	if r.Body != nil {
		body, _ = io.ReadAll(io.LimitReader(r.Body, 8<<20))
	}
	headers := map[string]string{}
	for _, key := range []string{"Content-Type", "Accept"} {
		if value := r.Header.Get(key); value != "" {
			headers[key] = value
		}
	}
	status, respHeaders, chunks, err := g.stdio.Do(r.Context(), id, r.Method, "/"+rest, headers, body)
	if err != nil {
		upstreamError(w, err.Error())
		return
	}
	for key, value := range respHeaders {
		w.Header().Set(key, value)
	}
	if status == 0 {
		status = http.StatusOK
	}
	w.WriteHeader(status)
	flusher, _ := w.(http.Flusher)
	for chunk := range chunks {
		if _, err := w.Write(chunk); err != nil {
			return
		}
		if flusher != nil {
			flusher.Flush()
		}
	}
}
