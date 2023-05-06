import {main_fetch,sortUTV,sortPIL} from './fetcher.js';
import { jointfunc } from './make_pagelist_table.js';

function user_not_found(area){
    var to_write=document.querySelector(`${area} .to_write`);
    to_write.innerHTML='您還未有評分紀錄';
    var tbp=document.querySelectorAll('.to_be_panel');
    for(var i=0;i<tbp.length;i++){
        tbp[i].classList.add('content-panel');
        tbp[i].classList.add('standalone');
        tbp[i].classList.add('content-row');
        tbp[i].classList.remove('to_be_panel');
    }
}

async function area_writer(userid='4213515',area_code='O'){
    var herearea;
    if (area_code == 'O') herearea = '#original_area';
    if (area_code == 'T') herearea = '#translation_area';

    const data_dict = await main_fetch()
    const complied_uvt = sortUTV(
        userid, sortPIL(data_dict[`${area_code}_PIL`],data_dict[`${area_code}_AR`]),data_dict[`${area_code}_UVT`])
    if (complied_uvt==undefined){
        user_not_found(herearea)
        return
    }
    var to_write_data =[]
    for (const element of complied_uvt){
        to_write_data.push(
            {
                'TITLE' : element['title'],
                'FULLNAME' : element['fullname'],
                'RATING' : element['rating'],
                'COMMENTS' : element['comments']
            }
        )
    }
    jointfunc(herearea,to_write_data.reverse(),20000,20)
}

let user_id=window.location.search;
user_id=user_id.substring(1,user_id.length);
console.log(user_id)
area_writer(user_id,'O')
area_writer(user_id,'T')