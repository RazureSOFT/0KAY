; 0KAY desktop installer customisation.
;
; The desktop app always installs Core, 0kay-pm and the Node runtime. The pages
; let the user drop optional components and choose the local ports.
!include "MUI2.nsh"
!include "nsDialogs.nsh"
!include "LogicLib.nsh"
!include "WinMessages.nsh"

!ifndef BUILD_UNINSTALLER
  Var okayWebUI
  Var okayTUI
  Var okayLIFE
  Var okayMocr
  Var okayAgent
  Var okayPath
  Var okayInstallWebUI
  Var okayInstallTUI
  Var okayInstallLIFE
  Var okayInstallMocr
  Var okayInstallAgent
  Var okayInstallPath
  Var okayTitleFont

  Var okayHTTP
  Var okayGRPC
  Var okayMocrPortField
  Var okayLifePortField
  Var okayAgentPortField
  Var okayHTTPPort
  Var okayGRPCPort
  Var okayMocrPort
  Var okayLifePort
  Var okayAgentPort

  !macro okayPortsDiffer A B
    StrCmp "${A}" "${B}" 0 +3
      MessageBox MB_OK|MB_ICONEXCLAMATION "Ports must be different."
      Abort
  !macroend

  !macro okayValidatePort VALUE
    IntOp $R0 "${VALUE}" + 0
    IntCmp $R0 1 0 okayPortsBad 0
    IntCmp $R0 65535 0 0 okayPortsBad
  !macroend

  !macro okayEnsurePortDefaults
    StrCmp $okayHTTPPort "" 0 +2
      StrCpy $okayHTTPPort "8080"
    StrCmp $okayGRPCPort "" 0 +2
      StrCpy $okayGRPCPort "50051"
    StrCmp $okayMocrPort "" 0 +2
      StrCpy $okayMocrPort "50052"
    StrCmp $okayLifePort "" 0 +2
      StrCpy $okayLifePort "50053"
    StrCmp $okayAgentPort "" 0 +2
      StrCpy $okayAgentPort "50054"
  !macroend

  !macro customPageAfterChangeDir
    Page custom okayComponentsCreate okayComponentsLeave
    Page custom okayPortsCreate okayPortsLeave
  !macroend

  Function okayComponentsCreate
    nsDialogs::Create 1018
    Pop $0
    ${If} $0 == error
      Abort
    ${EndIf}

    CreateFont $okayTitleFont "Segoe UI Semibold" 13 700
    ${NSD_CreateLabel} 0 8u 100% 14u "Components"
    Pop $0
    SendMessage $0 ${WM_SETFONT} $okayTitleFont 1
    SetCtlColors $0 0x6A6A00

    ${NSD_CreateLabel} 0 24u 100% 10u "Core, 0kay-pm and Node are required. Pick what else you want."
    Pop $0

    ${NSD_CreateCheckbox} 0 44u 100% 9u "WebUI - browser interface served by Core"
    Pop $okayWebUI
    ${NSD_Check} $okayWebUI

    ${NSD_CreateCheckbox} 0 57u 100% 9u "Terminal client (0kay, 0kay-tui)"
    Pop $okayTUI
    ${NSD_Check} $okayTUI

    ${NSD_CreateCheckbox} 0 70u 100% 9u "LIFE companion - persona and memory"
    Pop $okayLIFE
    ${NSD_Check} $okayLIFE

    ${NSD_CreateCheckbox} 0 83u 100% 9u "mocr - model gateway"
    Pop $okayMocr
    ${NSD_Check} $okayMocr

    ${NSD_CreateCheckbox} 0 96u 100% 9u "Agent + MCP plugins"
    Pop $okayAgent
    ${NSD_Check} $okayAgent

    ${NSD_CreateCheckbox} 0 110u 100% 9u "Add 0KAY to PATH (0kay, 0kay-tui, 0kay-pm)"
    Pop $okayPath
    ${NSD_Check} $okayPath

    ${NSD_CreateLabel} 0 124u 100% 10u "More plugins can be added later with 0kay-pm."
    Pop $0

    !insertmacro MUI_HEADER_TEXT "Components" "Choose what to install"
    nsDialogs::Show
  FunctionEnd

  Function okayComponentsLeave
    ${NSD_GetState} $okayWebUI $0
    ${If} $0 == ${BST_CHECKED}
      StrCpy $okayInstallWebUI "1"
    ${Else}
      StrCpy $okayInstallWebUI "0"
    ${EndIf}

    ${NSD_GetState} $okayTUI $0
    ${If} $0 == ${BST_CHECKED}
      StrCpy $okayInstallTUI "1"
    ${Else}
      StrCpy $okayInstallTUI "0"
    ${EndIf}

    ${NSD_GetState} $okayLIFE $0
    ${If} $0 == ${BST_CHECKED}
      StrCpy $okayInstallLIFE "1"
    ${Else}
      StrCpy $okayInstallLIFE "0"
    ${EndIf}

    ${NSD_GetState} $okayMocr $0
    ${If} $0 == ${BST_CHECKED}
      StrCpy $okayInstallMocr "1"
    ${Else}
      StrCpy $okayInstallMocr "0"
    ${EndIf}

    ${NSD_GetState} $okayAgent $0
    ${If} $0 == ${BST_CHECKED}
      StrCpy $okayInstallAgent "1"
    ${Else}
      StrCpy $okayInstallAgent "0"
    ${EndIf}

    ${NSD_GetState} $okayPath $0
    ${If} $0 == ${BST_CHECKED}
      StrCpy $okayInstallPath "1"
    ${Else}
      StrCpy $okayInstallPath "0"
    ${EndIf}
  FunctionEnd

  Function okayPortsCreate
    nsDialogs::Create 1018
    Pop $0
    ${If} $0 == error
      Abort
    ${EndIf}

    CreateFont $okayTitleFont "Segoe UI Semibold" 13 700
    ${NSD_CreateLabel} 0 8u 100% 14u "Ports"
    Pop $0
    SendMessage $0 ${WM_SETFONT} $okayTitleFont 1
    SetCtlColors $0 0x6A6A00

    ${NSD_CreateLabel} 0 24u 100% 10u "Choose local ports. The WebUI uses the Core HTTP port."
    Pop $0

    ${NSD_CreateLabel} 0 42u 70u 9u "Core HTTP"
    Pop $0
    StrCpy $R0 "8080"
    StrCmp $okayHTTPPort "" +2 0
    StrCpy $R0 $okayHTTPPort
    ${NSD_CreateText} 80u 41u 42u 11u "$R0"
    Pop $okayHTTP

    ${NSD_CreateLabel} 0 60u 70u 9u "Core gRPC"
    Pop $0
    StrCpy $R0 "50051"
    StrCmp $okayGRPCPort "" +2 0
    StrCpy $R0 $okayGRPCPort
    ${NSD_CreateText} 80u 59u 42u 11u "$R0"
    Pop $okayGRPC

    ${NSD_CreateLabel} 0 78u 70u 9u "mocr gRPC"
    Pop $0
    StrCpy $R0 "50052"
    StrCmp $okayMocrPort "" +2 0
    StrCpy $R0 $okayMocrPort
    ${NSD_CreateText} 80u 77u 42u 11u "$R0"
    Pop $okayMocrPortField

    ${NSD_CreateLabel} 0 96u 70u 9u "LIFE gRPC"
    Pop $0
    StrCpy $R0 "50053"
    StrCmp $okayLifePort "" +2 0
    StrCpy $R0 $okayLifePort
    ${NSD_CreateText} 80u 95u 42u 11u "$R0"
    Pop $okayLifePortField

    ${NSD_CreateLabel} 0 114u 70u 9u "Agent gRPC"
    Pop $0
    StrCpy $R0 "50054"
    StrCmp $okayAgentPort "" +2 0
    StrCpy $R0 $okayAgentPort
    ${NSD_CreateText} 80u 113u 42u 11u "$R0"
    Pop $okayAgentPortField

    !insertmacro MUI_HEADER_TEXT "Ports" "Choose local ports"
    nsDialogs::Show
  FunctionEnd

  Function okayPortsLeave
    ${NSD_GetText} $okayHTTP $okayHTTPPort
    ${NSD_GetText} $okayGRPC $okayGRPCPort
    ${NSD_GetText} $okayMocrPortField $okayMocrPort
    ${NSD_GetText} $okayLifePortField $okayLifePort
    ${NSD_GetText} $okayAgentPortField $okayAgentPort

    !insertmacro okayEnsurePortDefaults
    !insertmacro okayValidatePort $okayHTTPPort
    !insertmacro okayValidatePort $okayGRPCPort
    !insertmacro okayValidatePort $okayMocrPort
    !insertmacro okayValidatePort $okayLifePort
    !insertmacro okayValidatePort $okayAgentPort

    !insertmacro okayPortsDiffer $okayHTTPPort $okayGRPCPort
    !insertmacro okayPortsDiffer $okayHTTPPort $okayMocrPort
    !insertmacro okayPortsDiffer $okayHTTPPort $okayLifePort
    !insertmacro okayPortsDiffer $okayHTTPPort $okayAgentPort
    !insertmacro okayPortsDiffer $okayGRPCPort $okayMocrPort
    !insertmacro okayPortsDiffer $okayGRPCPort $okayLifePort
    !insertmacro okayPortsDiffer $okayGRPCPort $okayAgentPort
    !insertmacro okayPortsDiffer $okayMocrPort $okayLifePort
    !insertmacro okayPortsDiffer $okayMocrPort $okayAgentPort
    !insertmacro okayPortsDiffer $okayLifePort $okayAgentPort
    Return

    okayPortsBad:
      MessageBox MB_OK|MB_ICONEXCLAMATION "Ports must be numbers between 1 and 65535."
      Abort
  FunctionEnd

  !macro customInstall
    !insertmacro okayEnsurePortDefaults

    ${If} $okayInstallWebUI == "0"
      RMDir /r "$INSTDIR\resources\0kay\webui"
    ${EndIf}
    ${If} $okayInstallTUI == "0"
      Delete "$INSTDIR\resources\0kay\bin\0kay-tui.exe"
      Delete "$INSTDIR\resources\0kay\0kay.cmd"
    ${EndIf}
    ${If} $okayInstallLIFE == "0"
      Delete "$INSTDIR\resources\0kay\bin\0kay-life.exe"
      RMDir /r "$INSTDIR\resources\0kay\world"
      RMDir /r "$INSTDIR\resources\0kay\skills"
      RMDir /r "$INSTDIR\resources\0kay\models"
    ${EndIf}
    ${If} $okayInstallMocr == "0"
      Delete "$INSTDIR\resources\0kay\bin\mocr.exe"
    ${EndIf}
    ${If} $okayInstallAgent == "0"
      RMDir /r "$INSTDIR\resources\0kay\agent"
      RMDir /r "$INSTDIR\resources\0kay\mcp"
      RMDir /r "$INSTDIR\resources\0kay\proto"
    ${EndIf}

    FileOpen $9 "$INSTDIR\resources\0kay\runtime-env.json" w
    FileWrite $9 '{$\r$\n'
    FileWrite $9 '  "CORE_HTTP_PORT": "$okayHTTPPort",$\r$\n'
    FileWrite $9 '  "CORE_GRPC_PORT": "$okayGRPCPort",$\r$\n'
    FileWrite $9 '  "MOCR_GRPC_PORT": "$okayMocrPort",$\r$\n'
    FileWrite $9 '  "LIFE_GRPC_PORT": "$okayLifePort",$\r$\n'
    FileWrite $9 '  "AGENT_GRPC_PORT": "$okayAgentPort"$\r$\n'
    FileWrite $9 '}$\r$\n'
    FileClose $9

    ${If} $okayInstallPath != "0"
      nsExec::ExecToLog 'powershell -NoProfile -ExecutionPolicy Bypass -File "$INSTDIR\resources\0kay\bin\0kay-path.ps1" "$INSTDIR\resources\0kay\bin"'
      SendMessage ${HWND_BROADCAST} ${WM_SETTINGCHANGE} 0 "STR:Environment" /TIMEOUT=5000
    ${EndIf}
  !macroend
!endif

!macro customRemoveFiles
  nsExec::ExecToLog 'powershell -NoProfile -ExecutionPolicy Bypass -File "$INSTDIR\resources\0kay\bin\0kay-path.ps1" "$INSTDIR\resources\0kay\bin" -Remove'
  nsExec::ExecToLog '"$INSTDIR\resources\0kay\bin\0kay.exe" down'
  RMDir /r "$INSTDIR"
!macroend
