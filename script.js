var lastInvite = null;
function buildInvite(){
    var t = document.getElementById('evTitle').value;
    if(t==''){
        alert("Give the details correctly..");
        return;
    }
    var selectedTheme = document.querySelector('input[name="evTheme"]:checked').value;
    lastInvite={
        title:t,
        host:document.getElementById('evHost').value,
        date:document.getElementById('evDate').value,
        time:document.getElementById('evTime').value,
        location:document.getElementById('evPlace').value,
        message:document.getElementById('evNote').value,
        theme: selectedTheme
    };
    document.getElementById('inviteCard').className = 'invite-card '+selectedTheme;
    document.getElementById('showTitle').innerHTML=lastInvite.title;
    document.getElementById('showHost').innerHTML=lastInvite.host?'Hosted by '+ lastInvite.host:"";
    document.getElementById('showNote').innerHTML = lastInvite.message || '';

    var when='-';
    if(lastInvite.date){
        var p = lastInvite.date.split('-');
        var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
        var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
        var d = new Date(p[0],p[1]-1,p[2]);
        when = days[d.getDay()] + ', ' + months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
        if (lastInvite.time) {
            var tp = lastInvite.time.split(':');
            var h = tp[0] * 1;
            var ampm = h < 12 ? 'am' : 'pm';
            if (h == 0) h = 12;
            if (h > 12) h = h - 12;
            when += ', ' + h + ':' + tp[1] + ' ' + ampm;
        }
    }
    document.getElementById('showWhen').innerHTML=when;
    if(lastInvite.location){
        document.getElementById('placeBox').style.display='';
        document.getElementById('showPlace').innerHTML=lastInvite.location;

    }else{
        document.getElementById("placeBox").style.display="none";

    }
    document.getElementById('formSide').style.display="none";
    document.getElementById('previewSide').style.display='block';
    document.getElementById('shareArea').style.display = 'none';

}
function makeLink(){
    if(!lastInvite) return;
    var str = JSON.stringify(lastInvite);
    var b64 = btoa(unescape(encodeURIComponent(str)));
    b64 = b64.replace(/\+/g,'-').replace(/\//g, '_').replace(/=/g, '');
    var link = location.origin + location.pathname + "#invite=" + b64;

    document.getElementById('linkField').value=link;
    document.getElementById('shareArea').style.display='block';
    document.getElementById('copiedNote').style.display='none';
    history.replaceState(null,'','#invite='+b64);


}
function copyLink(){
    var box = document.getElementById('linkField');
    navigator.clipboard.writeText(box.value);
    document.getElementById('copiedNote').style.display='block';
    setTimeout(function(){
        document.getElementById('copiedNote').style.display='none';
    },2500)

}
function goBack(){
    document.getElementById('previewSide').style.display='none';
    document.getElementById('formSide').style.display='block';
    history.replaceState(null,'',location.pathname);
}
function startOver(){
    document.getElementById('evTitle').value='';
    document.getElementById('evHost').value = '';
    document.getElementById('evDate').value='';
    document.getElementById('evTime').value = '';
    document.getElementById('evPlace').value='';
    document.getElementById('evNote').value = '';
    lastInvite=null;
    document.getElementById('previewSide').style.display= 'none';
    document.getElementById('formSide').style.display='block';
    document.getElementById('shareArea').style.display='none';
    history.replaceState(null,'',location.pathname);

    

}
if(location.hash.indexOf('#invite')==0){
    try{
        var b64 = location.hash.slice(8);
        b64= b64.replace(/-/g,'+').replace(/_/g,'/');
        while (b64.length%4) b64 += "=";
        var data = JSON.parse(decodeURIComponent(escape(atob(b64))));
        if(data && data.title){
            lastInvite=data;
            document.getElementById('evTitle').value=data.title||'';
            document.getElementById('evHost').value=data.host||'';
            document.getElementById('evDate').value=data.date||'';
            document.getElementById('evTime').value=data.time||'';
            document.getElementById('evPlace').value=data.location||'';
            document.getElementById('evNote').value=data.message||'';
            if(data.theme){
                var r = document.querySelector('input[name="evTheme"][value="' + data.theme + '"]');
            }
            buildInvite();
            
        }
    }catch(e){
        console.log(e.message);
    }
}