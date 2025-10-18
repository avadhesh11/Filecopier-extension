const filein=document.getElementById("fileInput");
const filelist=document.getElementById("fileList");
const search=document.getElementById("searchInput");
// const searchbtn=document.getElementById("searchbtn");
let all=[];
function showToast(message) {
  const toast = document.createElement("div");
  toast.textContent = message;
  toast.style.position = "fixed";
  toast.style.bottom = "10px";
  toast.style.left = "50%";
  toast.style.transform = "translateX(-50%)";
  toast.style.background = "#333";
  toast.style.color = "#fff";
  toast.style.padding = "5px 10px";
  toast.style.borderRadius = "5px";
  toast.style.opacity = "0.9";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 1500);
}
function display(files){
    filelist.innerHTML="";
    if(files.length===0){
    filelist.innerHTML = "<p>No files added yet.</p>";
    return;
    }
    files.forEach((file,index)=>{
    const div=document.createElement("div");
    div.className="file";
    div.innerHTML=`
    <span title="${file.name}">${file.name}</span>
     <div>
        <button class="copy">Copy</button>
        <button class="delete">X</button>
      </div>
    `;
    div.querySelector(".copy").addEventListener("click",async()=>{
      await navigator.clipboard.writeText(file.content);
      showToast("content of file copied successfully");
    })

    div.querySelector(".delete").addEventListener("click",async()=>{
    const updated=files.filter((_, i) => i !== index);
    all=updated;
      await chrome.storage.local.set({ files: updated});
      display(updated);
    })

filelist.appendChild(div);
    });
   


}
chrome.storage.local.get("files",(data)=>{
    const files=data.files || [];
    all=files;
    display(files);
})

filein.addEventListener("change",async(e)=>{
    const file=e.target.files;
    const data=await chrome.storage.local.get("files");
    const saved=data.files || [];

    for(const f of file){
     const txt=await f.text();
     saved.push({name:f.name,content:txt});
    }
    all=saved;
    await chrome.storage.local.set({files:saved});
    display(saved);
    filein.value="";
});
search.addEventListener("input", () => {
  const query=search.value.toLowerCase();
  const filtered=all.filter(file => file.name.toLowerCase().includes(query));
  display(filtered);
});
