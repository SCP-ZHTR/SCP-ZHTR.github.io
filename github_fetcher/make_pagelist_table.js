const range = (number) => {return Array.from(Array(number).keys())}
const all_eventListener_add = (nodes, type, func) => {Array.from(nodes).map(
        (node) => {node.addEventListener(type, func)})
}
const all_innerHTML_set = (nodes, contents) => {Array.from(nodes).map(
    (node) => {node.innerHTML = contents})
}
const all_classList_add = (nodes, to_adds) => {
    if (Array.isArray(to_adds)){}
    else to_adds = [to_adds]
    Array.from(nodes).map(
    (node) => {
        to_adds.map(
            (to_add => {node.classList.add(to_add)})
        )
    })
}
const all_classList_remove = (nodes, to_removes) => {
    if (Array.isArray(to_removes)){}
    else to_removes = [to_removes]
    Array.from(nodes).map(
    (node) => {
        to_removes.map(
            (to_remove => {node.classList.remove(to_remove)})
        )
    })
}

function start_table(area,data,limit){
    document.querySelector(`${area} .to_write`).innerHTML=`<table style="width: 100%;"></table>`;
    const top_row = '<tr class="TOPROW"></tr>'
    const naive_entries = new Array(Math.min(data.length, limit)).fill("<tr class='NAIVE ENTRY'></tr>")
    const in_table = top_row + naive_entries.join('')
    document.querySelector(`${area} .to_write table`).innerHTML=in_table;
}

function make_top_row(area){
    document.querySelector(`${area} .TOPROW`).innerHTML = 
    ['條目標題', '評分', '評論數'].map
        (
        (title) => {return `<td>${title}</td>`}
        )
    .join('')
}

const dot_span="<span class='dot'>...</span>";
const pager_no='<span class="pager-no"></span>';
const next_page=`<span class="NEXT PN_button page_button">
<a href="javascript:void(0);">
<span class="target">下一頁</span>
</a>
</span>`;
const previous_page=`<span class="PREVIOUS HIDE_PN PN_button page_button">
<a href="javascript:void(0);">
<span class="target">上一頁</span>
</a>
</span>`


function pb_wrapper(str){
    return `<span class="page_button">
    <a href="javascript:void(0);">
    <span class="target">${str}</span>
    </a>
    <span class="pre-current">${str}</span>
    </span>`
}


function tr_listing(area,perpage){
    var page_ind = 0
    const To_deNAIVE = Math.ceil(
        document.querySelectorAll(`${area} tr.NAIVE`).length / perpage
    )
    const naive_nodes = document.querySelectorAll(`${area} tr.NAIVE`)
    range(To_deNAIVE).map(
        (page_ind_minus_1) => {
            page_ind = page_ind_minus_1 + 1
            const nodes_to_work = Array.from(naive_nodes).slice((page_ind-1) * perpage, Math.min(page_ind * perpage, naive_nodes.length))
            all_classList_add(nodes_to_work, `page${page_ind}`)
            all_classList_remove(nodes_to_work, `NAIVE`)
        }
    )

    var pager_str = ''
    if(To_deNAIVE <= 10 && To_deNAIVE > 1){
        pager_str = range(To_deNAIVE).map(
            (page_index) => {return pb_wrapper(page_index+1)}
        )
        .join('')
    }
    else if(To_deNAIVE > 10){
        pager_str = range(3).map(
            (page_index) => {return pb_wrapper(page_index+1)}
        )
        .join('') + `${dot_span}${pb_wrapper(page_ind)}`
    }

    const pager_nodes = document.querySelectorAll(`${area} .pager`)
    all_innerHTML_set(pager_nodes, `${pager_no}${previous_page}${pager_str}${next_page}`)
}

function td_organ(item, tr_ele){
    var a_part = `<a target="_blank"
     href='http://scp-zh-tr.wikidot.com/${item['FULLNAME']}'>
     ${item['TITLE']}
     </a>`;
    var r_part = `${item['RATING']}`;
    var c_part = `${item['COMMENTS']}`;
    tr_ele.innerHTML = [a_part, r_part, c_part].map(
        (ele) => {return `<td>${ele}</td>`}
    ).join('')
}

function td_listing(area, data){
    Array.from(document.querySelectorAll(`${area} tr.ENTRY`)).map(
        (node, index) => {
            td_organ(data[index], node)
        }
    )
}

function add_page_changer(area,no){
    const MaxInd = document.querySelector(`${area} .pager>.page_button:nth-last-child(2)>span`).innerHTML

    all_classList_remove(document.querySelectorAll(`${area} tr.ENTRY`), 'showing')
    all_classList_add(document.querySelectorAll(`${area} .page${no}`), 'showing')

    const ifdot = document.querySelector(`${area} .dot`)
    if(ifdot !== null){
        const nno=Number(no);
        if(no > 3 && no < MaxInd-2){
            var new_pager=`
            ${dot_span}
            ${pb_wrapper(`${nno-1}`)}${pb_wrapper(`${nno}`)}${pb_wrapper(`${nno+1}`)}
            ${dot_span}
            `
        }
        else if(no == 3){
            var new_pager=`
            ${pb_wrapper(`${nno-1}`)}${pb_wrapper(`${nno}`)}${pb_wrapper(`${nno+1}`)}
            ${dot_span}
            `
        }
        else if(no == MaxInd-2){
            var new_pager=`
            ${dot_span}
            ${pb_wrapper(`${nno-1}`)}${pb_wrapper(`${nno}`)}${pb_wrapper(`${nno+1}`)}
            `
        }
        else if(no == MaxInd || no == MaxInd-1){
            var new_pager=`
            ${dot_span}
            ${pb_wrapper(MaxInd-2)}${pb_wrapper(MaxInd-1)}`
        }
        else{
            var new_pager=`${pb_wrapper('2')}${pb_wrapper('3')}
            ${dot_span}`
        }

        new_pager=`${pager_no}${previous_page}${pb_wrapper('1')}${new_pager}${pb_wrapper(MaxInd)}${next_page}`

        const pager = document.querySelectorAll(`${area} .pager`);
        all_innerHTML_set(pager, new_pager)

        var page_targets = document.querySelectorAll(`${area} .page_button:not(.PN_button)`);
        var pager_next=document.querySelectorAll(`${area} .page_button.NEXT`);
        var pager_previous=document.querySelectorAll(`${area} .PREVIOUS`);
        all_eventListener_add(page_targets, "click", to_certain_page)
        all_eventListener_add(pager_next, "click", to_next_page)
        all_eventListener_add(pager_previous, "click", to_previous_page)
    }
    else{
        page_targets = document.querySelectorAll(`${area} .page_button:not(.PN_button)`);
        pager_next = document.querySelectorAll(`${area} .page_button.NEXT`);
        pager_previous = document.querySelectorAll(`${area} .PREVIOUS`);
    }

    const HIDE_PN = 'HIDE_PN'
    const num_and_hide = (certain_num, to_hide) =>{
        return (num_to_trial) =>{
            if(num_to_trial == certain_num) all_classList_add(to_hide, HIDE_PN)
            else all_classList_remove(to_hide, HIDE_PN)
        }
    }
    
    num_and_hide(MaxInd, pager_next)(no)
    num_and_hide(1, pager_previous)(no)
    all_classList_remove(page_targets, 'current')
    all_classList_add(Array.from(page_targets).filter((node) => {
        return node.children[1].innerHTML == no}), 'current')
    var pager_pointer=document.querySelectorAll(`${area} .pager-no`);
    all_innerHTML_set(pager_pointer, `第 ${no} 頁`)
}

function to_certain_page(){
    var area = `#${this.parentNode.parentNode.id}`;
    var no = this.children[1].innerHTML;
    add_page_changer(area,no);
}

function to_next_page(){
    var area=`#${this.parentNode.parentNode.id}`;
    var no=document.querySelector(`${area} .current .pre-current`).innerHTML;
    no = `${Number(no)+1}`
    add_page_changer(area,no);
}

function to_previous_page(){
    var area = `#${this.parentNode.parentNode.id}`;
    var no = document.querySelector(`${area} .current .pre-current`).innerHTML;
    no = `${Number(no)-1}`
    add_page_changer(area,no);
}


function getready(area){

    const trs=document.querySelectorAll(`${area} tr.page1`);
    all_classList_add(trs, 'showing')

    const page_targets = document.querySelectorAll(`${area} .page_button:not(.PN_button)`)
    const pager_next=document.querySelectorAll(`${area} .page_button.NEXT`);
    const pager_previous=document.querySelectorAll(`${area} .PREVIOUS`);
    all_classList_remove(page_targets, 'current')
    all_eventListener_add(page_targets, "click", to_certain_page)
    all_eventListener_add(pager_next, "click", to_next_page)
    all_eventListener_add(pager_previous, "click", to_previous_page)

    const no = '1';
    const pager_pointer = document.querySelectorAll(`${area} .pager-no`);
    all_classList_add(Array.from(page_targets).filter((node) => {
        return node.children[1].innerHTML == no}), 'current')
    all_innerHTML_set(pager_pointer, `第 ${no} 頁`)

    const tbp=document.querySelectorAll('.to_be_panel');
    all_classList_add(tbp, ['content-panel', 'standalone', 'content-row'])
    all_classList_remove(tbp, 'to_be_panel')
}

function jointfunc(area, data, limit, perpage){
    start_table(area,data,limit)
    make_top_row(area)
    tr_listing(area,perpage)
    td_listing(area,data)
    getready(area)

    const pager = document.querySelectorAll(`${area} .pager`)
    if(data.length < perpage){
        all_classList_add(pager, 'to_hide')
    }
    else{
        all_classList_remove(pager, 'to_hide')
    }
}

export{jointfunc}