package server

import (
 "testing"
 "path/filepath"
 "os"
 "encoding/json"
 "strings"
)

func TestCancelledTaskCannotBecomeDone(t *testing.T) {
	s := &CoreServiceServer{tasks: map[string]*TaskInfo{"task": {State: "cancelled"}}}
	s.finishTask("task", "done", "late result", "")
	if s.tasks["task"].State != "cancelled" {
		t.Fatal("late execution overwrote cancellation")
	}
	if s.tasks["task"].Result != "" {
		t.Fatal("cancelled task accepted a success result")
	}
}

func TestTaskLedgerAndSessionHistory(t *testing.T) {
 s := &CoreServiceServer{tasks:map[string]*TaskInfo{}, taskHistoryPath:filepath.Join(t.TempDir(),"tasks.json")}
 session,err:=s.CreateAgentSession("Coding")
 if err!=nil || !s.HasAgentSession(session) { t.Fatalf("create session: %v",err) }
 if err=s.RecordTask(TaskEvent{TaskID:"first",SessionID:session,Kind:"agent",Prompt:"make file",State:"pending"});err!=nil { t.Fatal(err) }
 if err=s.RecordTask(TaskEvent{TaskID:"second",SessionID:session,Kind:"agent",State:"pending"});err==nil { t.Fatal("concurrent session turn accepted") }
 if err=s.RecordTask(TaskEvent{TaskID:"first",State:"done",Result:"created example.py"});err!=nil {t.Fatal(err)}
 prompt:=s.AgentSessionPrompt(session,"second","run it")
 if !strings.Contains(prompt,"example.py") || !strings.Contains(prompt,"run it") {t.Fatal(prompt)}
 for i:=0;i<60;i++ { id:=string(rune('a'+i)); _=s.RecordTask(TaskEvent{TaskID:id,Kind:"tool",State:"running"}); s.finishTask(id,"done","ok","") }
 if len(s.ListTasks())<62 {t.Fatal("task history was silently truncated")}
 data,err:=os.ReadFile(s.taskHistoryPath);if err!=nil {t.Fatal(err)}
 var saved []persistedTask
 if err=json.Unmarshal(data,&saved);err!=nil {t.Fatal(err)}
 restored:=&CoreServiceServer{tasks:map[string]*TaskInfo{},taskHistoryPath:s.taskHistoryPath}
 for _,item:=range saved {restored.tasks[item.TaskID]=&TaskInfo{TaskID:item.TaskID}}
 restored.replayTaskJournal()
 if len(restored.tasks)!=len(s.ListTasks()) {t.Fatal("ledger journal not persisted")}
}

func TestLifeSessionCanBeContinuedByUser(t *testing.T) {
 s:= &CoreServiceServer{tasks:map[string]*TaskInfo{}}
 id:=s.EnsureAgentSession("webui:original","life","Research")
 if !s.HasAgentSession(id) {t.Fatal("LIFE session missing")}
 if s.EnsureAgentSession("webui:original","life","followup")!=id {t.Fatal("LIFE continuation created a new session")}
 if s.EnsureAgentSession(id,"webui","direct question")!=id {t.Fatal("user could not join LIFE session")}
 _=s.RecordTask(TaskEvent{TaskID:"life-turn",Kind:"agent",SessionID:id,CallerID:"life",Prompt:"research this",State:"done",Result:"findings"})
 prompt:=s.AgentSessionPrompt(id,"user-turn","explain findings")
 if !strings.Contains(prompt,"LIFE:") || !strings.Contains(prompt,"findings") {t.Fatal(prompt)}
}

func TestArchiveDeleteAndStableOrdering(t *testing.T) {
 s:= &CoreServiceServer{tasks:map[string]*TaskInfo{}}
 id,_:=s.CreateAgentSession("session")
 _=s.RecordTask(TaskEvent{TaskID:"turn",SessionID:id,Kind:"agent",State:"done",Result:"kept"})
 if err:=s.ManageAgentSession(id,"archive");err!=nil {t.Fatal(err)}
 if s.HasAgentSession(id) {t.Fatal("archived session accepts turns")}
 if s.tasks["turn"].Result!="kept" {t.Fatal("archive deleted messages")}
 if err:=s.ManageAgentSession(id,"restore");err!=nil {t.Fatal(err)}
 if !s.HasAgentSession(id) {t.Fatal("restore failed")}
 first,_:=json.Marshal(s.ListTasks())
 for i:=0;i<20;i++ {next,_:=json.Marshal(s.ListTasks());if string(first)!=string(next){t.Fatal("unstable ordering")}}
 if err:=s.ManageAgentSession(id,"delete");err!=nil {t.Fatal(err)}
 if len(s.ListTasks())!=0 {t.Fatal("deleted session visible")}
 if err:=s.RecordTask(TaskEvent{TaskID:"late",SessionID:id,State:"done"});err==nil {t.Fatal("late event resurrected session")}
}

func TestCompactionReplacesContextButKeepsTranscript(t *testing.T) {
 s:= &CoreServiceServer{tasks:map[string]*TaskInfo{}}
 id,_:=s.CreateAgentSession("compact")
 _=s.RecordTask(TaskEvent{TaskID:"before",SessionID:id,Kind:"agent",Prompt:"old verbose text",State:"done",Result:"old result"})
 _=s.RecordTask(TaskEvent{TaskID:"summary",SessionID:id,Kind:"compact",State:"done",Result:"important retained facts"})
 _=s.RecordTask(TaskEvent{TaskID:"after",SessionID:id,Kind:"agent",Prompt:"new question",State:"done",Result:"new answer"})
 prompt:=s.AgentSessionPrompt(id,"next","continue")
 if strings.Contains(prompt,"old verbose text") || !strings.Contains(prompt,"important retained facts") || !strings.Contains(prompt,"new answer") {t.Fatal(prompt)}
 if s.tasks["before"]==nil {t.Fatal("compaction deleted transcript")}
}

func TestRenameSessionAndUsageDedup(t *testing.T) {
 s:= &CoreServiceServer{tasks:map[string]*TaskInfo{}, usage:NewUsageStore("")}
 id,_:=s.CreateAgentSession("Agent session")
 if err:=s.RenameAgentSession(id,"修复登录");err!=nil{t.Fatal(err)}
 if s.tasks[id].Prompt!="修复登录"{t.Fatalf("title=%q",s.tasks[id].Prompt)}
 s.RecordUsage(UsageRecord{RequestID:"dup",Model:"m",PromptTokens:1,CompletionTokens:1})
 s.RecordUsage(UsageRecord{RequestID:"dup",Model:"m",PromptTokens:1,CompletionTokens:1})
 if len(s.usage.records)!=1{t.Fatalf("duplicate request recorded: %d",len(s.usage.records))}
}
