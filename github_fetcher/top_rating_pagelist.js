import {main_fetch,sortUTV,sortPIL} from './fetcher.js';
import { jointfunc } from './make_pagelist_table.js';

async function sort_zip_filter(sorted_by='justified_rating',pagefilters=null){
    console.log(pagefilters)
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
    console.log(zippeds)
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
    console.log(data_to_write)
    const Areas = {'O':'#original_area','T':'#translation_area'}
    genres.map(genre => {
        jointfunc(Areas[genre],data_to_write[genre],20000,20)
    }
    )
}

function created_at_filter_generator(min,max){
    //2022-01-01 => [2022,1,1]
    const conditions = [min,max].map(
        date => {
            if(date==undefined) return undefined;
            const date_array = date.split('-').map(d=>parseInt(d))
            return new Date(date_array[0],date_array[1],date_array[2],0,0,0,0).getTime()
        }
    ).map(
        (timestamp,index)=>{
            if(timestamp==undefined) return undefined
            console.log(timestamp)
            const bigger_or_smaller = [(number)=>{return (trialed)=>{return trialed >= number}},
                (number)=>{return (trialed)=>{return trialed < number}}]
            return bigger_or_smaller[index](parseInt(timestamp/1000))
        }
    ).filter(condition => {return condition!==undefined})
    console.log(conditions)
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

writer(null,created_at_filter_generator('2021-01-01','2022-01-01'))
writer(null,created_at_filter_generator('2022-01-01','2023-01-01'))