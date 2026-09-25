package pairing

import (
	"encoding/json"
	"net/http/httptest"
	"strings"
	"testing"
)

func TestPairingRequiresLocalApprovalAndSecret(t *testing.T) {
	store, err := New(t.TempDir())
	if err != nil {
		t.Fatal(err)
	}
	request := httptest.NewRequest("POST", "/api/pairing/request", strings.NewReader(`{"name":"device"}`))
	request.RemoteAddr = "192.168.1.20:1234"
	writer := httptest.NewRecorder()
	store.handle(writer, request)
	var result map[string]interface{}
	json.Unmarshal(writer.Body.Bytes(), &result)
	id := result["id"].(string)
	secret := result["secret"].(string)
	code := result["code"].(string)
	approve := func(remote string) {
		r := httptest.NewRequest("POST", "/api/pairing/approve", strings.NewReader(`{"id":"`+id+`","code":"`+code+`","allow":true}`))
		r.RemoteAddr = remote
		w := httptest.NewRecorder()
		store.handle(w, r)
		if remote == "192.168.1.20:1234" && w.Code != 403 {
			t.Fatal("remote self-approval accepted")
		}
	}
	approve("192.168.1.20:1234")
	approve("127.0.0.1:1234")
	claim := httptest.NewRequest("POST", "/api/pairing/status", strings.NewReader(`{"id":"`+id+`","secret":"`+secret+`"}`))
	claim.RemoteAddr = "192.168.1.20:1234"
	w := httptest.NewRecorder()
	store.handle(w, claim)
	var paired map[string]interface{}
	json.Unmarshal(w.Body.Bytes(), &paired)
	if paired["approved"] != true || !store.valid(paired["token"].(string)) {
		t.Fatal(w.Body.String())
	}
}
