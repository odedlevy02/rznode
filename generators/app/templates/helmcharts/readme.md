# View helm output
Make sure to install helm on you local machine and then run the following:
```
helm template -f ./helm/configuration/staging/values.yaml -f ./helm/values.yaml --set image.tag=1.1 --set secrets.enabled=false <%=projectNameHyphen%> ./helm
```