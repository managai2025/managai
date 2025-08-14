package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"sync"
	"time"
)

type Event struct {
	ID    string                 `json:"id"`
	Type  string                 `json:"type"`
	TS    int64                  `json:"ts"`
	OrgID string                 `json:"org_id"`
	Data  map[string]any         `json:"data"`
}

type Message struct {
	ID     string                 `json:"id"`
	Status string                 `json:"status"` // queued|sent
	Meta   map[string]any         `json:"meta"`
}

var (
	mtx      sync.Mutex
	events   = []Event{}
	messages = []Message{}
)

func main() {
	http.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprint(w, "ok")
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		fmt.Fprint(w, `<main style="background:#000;color:#fff;min-height:100vh;padding:40px;font-family:system-ui">
<h1 style="color:#7ef2b3;margin:0 0 8px">ManagAI</h1>
<p>Go monolit fut. Hasznos végpontok:</p>
<ul>
<li><code>GET  /healthz</code></li>
<li><code>POST /api/demo/simulate</code> – 2 demo esemény + queued üzenetek</li>
<li><code>POST /api/cron/dispatch-messages</code> – queued → sent (Authorization: Bearer &lt;CRON_SECRET&gt;)</li>
<li><code>GET  /api/debug/state</code> – memória állapot (events/messages)</li>
</ul>
</main>`)
	})

	http.HandleFunc("/api/demo/simulate", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost {
			http.Error(w, "POST only", http.StatusMethodNotAllowed); return
		}
		org := os.Getenv("MANAGAI_ORG_ID")
		now := time.Now().Unix()

		ev1 := Event{ID: fmt.Sprintf("evt-%d-a", now), Type: "cart_abandoned", TS: now, OrgID: org,
			Data: map[string]any{"cart_total": 18990, "currency": "HUF", "email": "anna@example.com"}}
		ev2 := Event{ID: fmt.Sprintf("evt-%d-b", now), Type: "price_changed", TS: now, OrgID: org,
			Data: map[string]any{"sku": "SKU-123", "old": 9990, "new": 7990}}

		mtx.Lock()
		events = append(events, ev1, ev2)
		messages = append(messages,
			Message{ID: fmt.Sprintf("msg-%d-1", now), Status: "queued", Meta: map[string]any{"from_event": ev1.ID, "action": "email_send", "template": "cart_nudge_A"}},
			Message{ID: fmt.Sprintf("msg-%d-2", now), Status: "queued", Meta: map[string]any{"from_event": ev2.ID, "action": "email_send", "template": "price_drop_A"}},
		)
		mtx.Unlock()

		writeJSON(w, 200, map[string]any{"ok": true, "queued": 2})
	})

	http.HandleFunc("/api/cron/dispatch-messages", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != http.MethodPost && r.Method != http.MethodGet {
			http.Error(w, "POST/GET only", http.StatusMethodNotAllowed); return
		}
		secret := os.Getenv("CRON_SECRET")
		if secret != "" && r.Header.Get("Authorization") != "Bearer "+secret {
			http.Error(w, "Unauthorized", 401); return
		}
		sent := 0
		mtx.Lock()
		for i := range messages {
			if messages[i].Status == "queued" {
				messages[i].Status = "sent" // stub: itt menne SES/Resend/Mailgun
				sent++
			}
		}
		mtx.Unlock()
		writeJSON(w, 200, map[string]any{"ok": true, "sent": sent})
	})

	http.HandleFunc("/api/debug/state", func(w http.ResponseWriter, r *http.Request) {
		mtx.Lock()
		defer mtx.Unlock()
		writeJSON(w, 200, map[string]any{"events": events, "messages": messages})
	})

	addr := ":" + env("PORT", "8080")
	fmt.Println("listening on", addr)
	_ = http.ListenAndServe(addr, nil)
}

func env(k, d string) string { if v := os.Getenv(k); v != "" { return v }; return d }
func writeJSON(w http.ResponseWriter, code int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	_ = json.NewEncoder(w).Encode(v)
}
