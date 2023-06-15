import {main_fetch,sortUTV,sortPIL} from './fetcher.js';
import { jointfunc } from './make_pagelist_table.js';

async function sort_zip_filter(sorted_by='justified_rating',pagefilters=null){
    if(sorted_by==null) sorted_by = 'justified_rating'

    const genres = ['O','T']
    const data_dict = await main_fetch()
    const ARs = genres.map(genre => {return data_dict[`${genre}_AR`]})
    const PILs = genres.map(genre => {return data_dict[`${genre}_PIL`]})
    const sorted_ARs = ARs.map(
        AR => {return Object.entries(AR).map(
            ([created_at, page_ar]) => {
                if(sorted_by =='justified_rating')
                    {return {'created_at':created_at,
                        'justified_rating':page_ar['justified_rating']}}
                return {'created_at':created_at,
                    'justified_rating':page_ar['justified_rating'],
                        sorted_by:page_ar[sorted_by]}
        }).sort((a,b) => {return a[sorted_by] - b[sorted_by]}).reverse()}
        )

    const AR_zip_PIL = (AR_sorted,pageinfolist) => {
        return AR_sorted.map(ele=>{
            const pageinfo = pageinfolist[ele['created_at']]
            return{
            'TITLE' : pageinfo['title'],
            'FULLNAME' : pageinfo['fullname'],
            'RATING' : ele['justified_rating'],
            'COMMENTS' : pageinfo['comments'],
            'CREATED_AT' : parseInt(pageinfo['created_at'])
        }})
    }

    const zippeds = genres.map(
        (genre,i)=>{
            return AR_zip_PIL(sorted_ARs[i],PILs[i])
    })
    if (pagefilters==null) return(Object.fromEntries(zippeds.map((zipped,i)=>{return [genres[i],zipped]})))
    else return(
        Object.fromEntries(
            zippeds.map((zipped,i)=>{
                return [genres[i],zipped.filter(pagefilters)]})
        )
        )
}

async function writer(sorted_by='justified_rating',pagefilter=null){
    const genres = ['O','T']
    const data_to_write = await sort_zip_filter(sorted_by,pagefilter)
    const Areas = {'O':'#original_area','T':'#translation_area'}
    genres.map(genre => {
        jointfunc(Areas[genre],data_to_write[genre],300,20)
    }
    )
}

function created_at_filter_generator(min,max){
    //2022-01-01 => [2022,1,1]
    const conditions = [min,max].map(
        date => {
            if(date==undefined) return undefined;
            const date_array = date.split('-').map(d=>parseInt(d))
            return new Date(date_array[0],date_array[1]-1,date_array[2],0,0,0,0).getTime()
        }
    ).map(
        (timestamp,index)=>{
            if(timestamp==undefined) return undefined
            const bigger_or_smaller = [(number)=>{return (trialed)=>{return trialed >= number}},
                (number)=>{return (trialed)=>{return trialed < number}}]
            return bigger_or_smaller[index](parseInt(timestamp/1000))
        }
    ).filter(condition => {return condition!==undefined})
    const final_function = (trialed) => {
        const results = conditions.map(
            condition => {return condition(trialed['CREATED_AT'])}    
        )
        if (results.includes(false)){
        }
        else {
            return true
        }
    }
    return final_function
}

function change_header_with_season(header_id, season_start_day){
    const header = document.getElementById(header_id)
    var header_str;
    if (header_id.includes('original')){
        header_str = "最高分原創作品"
    }
    else{
        header_str = "最高分翻譯作品"
    }
    if (season_start_day==undefined){
        header.innerHTML = `${header_str}`
        return
    }

    const date_array = season_start_day.split('-').map(d=>parseInt(d))
    const year = date_array[0]
    const month = date_array[1]
    const season_dict = {
        3 : "春",
        6 : "夏",
        9 : "秋",
        12: "冬"
    }
    const season = season_dict[month]
    header.innerHTML = `${header_str}<${year}年${season}>`
}

export{created_at_filter_generator}
export{writer}
export{change_header_with_season}
