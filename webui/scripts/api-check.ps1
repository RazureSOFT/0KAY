function J($u,$m='GET',$b=$null){
  $o=@{Method=$m;Uri=$u;TimeoutSec=8;UseBasicParsing=$true}
  if($b){$o.Body=$b;$o.ContentType='application/json'}
  try{(Invoke-WebRequest @o).Content}catch{"ERR $($_.Exception.Message)"}
}
function Out($k,$u,$m='GET',$b=$null){
  Write-Output ($k+'='+(J $u $m $b))
}
Out 'MODELS' 'http://127.0.0.1:8080/api/models'
Out 'USAGE_CLEAR' 'http://127.0.0.1:8080/api/usage/clear' 'POST' '{}'
Out 'SEARXNG' 'http://127.0.0.1:8080/api/settings/searxng'
Out 'PROVIDER' 'http://127.0.0.1:8080/api/settings/provider'
Out 'SECTIONS' 'http://127.0.0.1:8080/api/settings/sections'
Out 'DIS' 'http://127.0.0.1:8080/api/plugins/disable' 'POST' '{"plugin":"life"}'
Out 'PATCHES_AFTER' 'http://127.0.0.1:8080/api/ui/patches'
Out 'SECTIONS_AFTER' 'http://127.0.0.1:8080/api/settings/sections'
Out 'LIFE_SEC' 'http://127.0.0.1:8080/api/settings/life'
Out 'RE' 'http://127.0.0.1:8080/api/plugins/enable' 'POST' '{"plugin":"life"}'
Out 'PATCHES_RE' 'http://127.0.0.1:8080/api/ui/patches'
Out 'USAGE_AFTER' 'http://127.0.0.1:8080/api/usage'
Out 'HEALTH' 'http://127.0.0.1:8080/health'
Out 'PLUGINS' 'http://127.0.0.1:8080/api/plugins'
