let uploadDoc = (obj,tags,taginp) => {
    let formdata = new FormData();
    if(!obj){
        alert("File left empty");
        return;
    }
    formdata.append("file", obj, obj.name);
    formdata.append("tags", tags);
    
    var requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow'
    };
    if(!tags ){
        alert("Tags cannot be left empty");
        return;
    }
    fetch("http://localhost:3000/upload", requestOptions)
      .then(response => response.text())
      .then(result => {
          console.log(result);
          document.getElementById("inputGroupFile04").value = "";
          document.getElementById("tag-input1").value = "";
          taginp.init({
            selector: 'tag-input1',
            duplicate : false,
            max : 10
          });
        })
      .catch(error => console.log('error', error));
}


let getDoc = (tags) => {
    let requestOptions = {
        method: 'GET',
        redirect: 'follow'
      };
      if(!tags ){
          alert("Tags left empty");
          return;
      }
      console.log("tags",tags);
      document.getElementById("doclist").innerHTML = "";
      fetch("http://localhost:3000/tags/"+tags, requestOptions)
        .then(response => response.text())
        .then(result => {
            genList(JSON.parse(result))
        })
        .catch(error => {console.log('error', error)});
}

let genList = (list) => {
    console.log(list)
    list.files.forEach(ele => {
        let name = ele.filename;
        let url = "http://localhost:3000/docs/"+ele.fileId;
        genTag(name,url);
    })
}

let genTag = (name,url) => {
    let li = document.createElement("li");
    li.classList.add("list-group-item","liStyles");
    let p = document.createElement("span");
    p.textContent = name;
    p.classList.add("spanStyle")
    let a = document.createElement("a");
    a.classList.add("btn","btn-outline-danger");
    a.href = url;
    a.textContent = "Download"
    li.appendChild(p);
    li.appendChild(a)
    document.querySelector("#doclist").appendChild(li);
}