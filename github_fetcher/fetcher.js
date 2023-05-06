function promiseFn(num, time = 500) {
    return new Promise((resolve, reject) => {
    setTimeout(() => {
        num ? resolve(`${num}, 成功`) : reject('失敗');
    }, time);
    });
}

  const URL_T_PIL = 'https://raw.githubusercontent.com/SCP-ZHTR/BackendStorage/main/Async_T_PIL_loop.json';
  const URL_O_PIL = 'https://raw.githubusercontent.com/SCP-ZHTR/BackendStorage/main/Async_O_PIL_loop.json';
  const URL_T_UVT = 'https://raw.githubusercontent.com/SCP-ZHTR/BackendStorage/main/Async_T_UVT.json';
  const URL_O_UVT = 'https://raw.githubusercontent.com/SCP-ZHTR/BackendStorage/main/Async_O_UVT.json';

  async function getdata(url){
    const response = await fetch(url);
    const data = await response.json()
    return data
  }

  function sortUTV(userid,pil,uvt){
    console.log('doing the sort')
    const personal_uvt = uvt[userid];
    if (personal_uvt == undefined){
        console.log('userid not found')
        return undefined
    }
    var complied_uvt = {}
    var created_at
    while(true){
        created_at = personal_uvt.pop()
        if(created_at==undefined) break
        created_at = created_at[0]
        var page_data = pil[created_at]
        if(page_data==undefined) continue
        complied_uvt[created_at] = page_data
    }
    return(complied_uvt)

  }

  async function main_fetch(){
    const t_pil = await getdata(URL_T_PIL)
    const t_uvt = await getdata(URL_T_UVT)
    const o_pil = await getdata(URL_O_PIL)
    const o_uvt = await getdata(URL_O_UVT)
    console.log('doing the fetch')
    return {
      'T_PIL' : t_pil,
      'O_PIL' : o_pil,
      'T_UVT' : t_uvt,
      'O_UVT' : o_uvt,
    }
  }

export{main_fetch}
export{sortUTV}