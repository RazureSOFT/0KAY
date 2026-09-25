package gateway
import("strings";"path/filepath";"os";"fmt";"encoding/json")
func isLive2DManifest(name string)bool{lower:=strings.ToLower(name);return strings.HasSuffix(lower,".model.json")||strings.HasSuffix(lower,".model3.json")}
func deleteLive2DModel(id string)error{
 if id=="" || strings.Contains(id,"\\") || strings.Contains(id,":") {return fmt.Errorf("invalid model id")}
 clean:=filepath.ToSlash(filepath.Clean(id));if clean=="." || clean==".." || strings.HasPrefix(clean,"../") || strings.HasPrefix(clean,"/"){return fmt.Errorf("invalid model id")}
 root:=live2DRoot();parts:=strings.Split(clean,"/")
 if len(parts)<2 {return fmt.Errorf("only models in an uploaded folder can be deleted")}
 found:=false;for _,model:=range listLive2DModels(){if model["id"]==id{found=true;break}}
 if !found{return fmt.Errorf("model not found")}
 target:=filepath.Join(root,parts[0]);info,err:=os.Lstat(target);if err!=nil{return err};if info.Mode()&os.ModeSymlink!=0{return fmt.Errorf("symbolic links cannot be deleted as models")}
 return os.RemoveAll(target)
}
func validateLive2DManifest(manifest string)error{
 data,err:=os.ReadFile(manifest);if err!=nil{return err};var model map[string]interface{}
 if err=json.Unmarshal(data,&model);err!=nil{return fmt.Errorf("invalid model manifest: %w",err)}
 files:=[]string{}
 if value,ok:=model["model"].(string);ok {files=append(files,value);if textures,ok:=model["textures"].([]interface{});ok{for _,texture:=range textures{if text,ok:=texture.(string);ok{files=append(files,text)}}}}
 if refs,ok:=model["FileReferences"].(map[string]interface{});ok {if value,ok:=refs["Moc"].(string);ok{files=append(files,value)};if textures,ok:=refs["Textures"].([]interface{});ok{for _,texture:=range textures{if text,ok:=texture.(string);ok{files=append(files,text)}}}}
 if len(files)<2{return fmt.Errorf("model manifest must reference a model binary and textures")}
 for _,file:=range files{clean:=filepath.Clean(filepath.FromSlash(file));if filepath.IsAbs(clean)||clean==".."||strings.HasPrefix(clean,".."+string(filepath.Separator)){return fmt.Errorf("invalid model resource path")};if _,err:=os.Stat(filepath.Join(filepath.Dir(manifest),clean));err!=nil{return fmt.Errorf("model resource missing: %s",file)}}
 return nil
}
