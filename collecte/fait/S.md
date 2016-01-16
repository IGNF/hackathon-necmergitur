#Les bibliothèques de prêt de Paris

http://meslieux.paris.fr/proxy/data/get/equipements/get_equipements?m_tid=235,237&limit=500&order=name%20ASC&lat=48.8742&lon=2.38

```
var garde =
    {  name:true,
     categorie_name:true,
     address:true,
     lat:true,
     lon:true,
     zip_code:true
    };

for (var i=0; i<t.length; i++)
{ for (k in t[i])
  {  if (!garde[k]) 
    {  delete t[i][k];
    }
   //else console.log(k)
  }
}

var c = JSON.stringify(t,false," ");
console.log(c);
```
