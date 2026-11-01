; Stop the bundled stack before the uninstaller removes its files. Windows keeps
; running executables locked, and an uninstall that leaves core.exe behind also
; leaves a tray-less process holding the ports.
!macro customUnInstall
  nsExec::ExecToLog '"$INSTDIR\resources\0kay\bin\0kay.exe" down'
!macroend
