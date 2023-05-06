function promiseFn(num, time = 500) {
    return new Promise((resolve, reject) => {
    setTimeout(() => {
        num ? resolve(`${num}, 成功`) : reject('失敗');
    }, time);
    });
}

  async function getdata(url){
    const response = await fetch(url);
    const data = await response.json()
    return data
  }

  function sortPIL(pil,ar){
    var new_pil = {}
    for (var [created_at,pageinfo] of Object.entries(pil)){
      pageinfo['rating'] = ar[created_at]['justified_rating']
      new_pil[created_at] = pageinfo
    }
    return new_pil
  }

  function sortUTV(userid,pil,uvt){
    console.log('doing the sort')
    const personal_uvt = uvt[userid];
    if (personal_uvt == undefined){
        console.log('userid not found')
        return undefined
    }
    var complied_uvt = []
    var created_at
    while(true){
        created_at = personal_uvt.pop()
        if(created_at==undefined) break
        created_at = created_at[0]
        var page_data = pil[created_at]
        if(page_data==undefined) continue
        complied_uvt.push(page_data)
    }
    return(complied_uvt)

  }


  const URL_T_PIL = 'https://raw.githubusercontent.com/SCP-ZHTR/BackendStorage/main/Async_T_PIL_loop.json';
  const URL_O_PIL = 'https://raw.githubusercontent.com/SCP-ZHTR/BackendStorage/main/Async_O_PIL_loop.json';
  const URL_T_UVT = 'https://raw.githubusercontent.com/SCP-ZHTR/BackendStorage/main/Async_T_UVT.json';
  const URL_O_UVT = 'https://raw.githubusercontent.com/SCP-ZHTR/BackendStorage/main/Async_O_UVT.json';
  const URL_T_AR = 'https://raw.githubusercontent.com/SCP-ZHTR/BackendStorage/main/Async_T_Adjusted_Rating.json.json';
  const URL_O_AR = 'https://raw.githubusercontent.com/SCP-ZHTR/BackendStorage/main/Async_O_Adjusted_Rating.json.json';


  async function main_fetch(){
    const t_pil = await getdata(URL_T_PIL)
    const t_uvt = await getdata(URL_T_UVT)
    const t_ar = await getdata(URL_T_AR)
    const o_pil = await getdata(URL_O_PIL)
    const o_uvt = await getdata(URL_O_UVT)
    const o_ar = await getdata(URL_O_AR)
    console.log('doing the fetch')
    return {
      'T_PIL' : t_pil,
      'O_PIL' : o_pil,
      'T_UVT' : t_uvt,
      'O_UVT' : o_uvt,
      'T_AR' : t_ar,
      'O_AR' : o_ar
    }
  }

export{main_fetch}
export{sortUTV}
export{sortPIL}