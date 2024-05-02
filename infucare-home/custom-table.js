
function _renderTableDOM(tableElement, tableObj) {
    tableElement.style.tableLayout = 'fixed';
    tableElement.className = 'table table-sm table-hover';
    const thead = document.createElement("thead");
    const tbody = document.createElement("tbody");
    const tfoot = document.createElement("tfoot");

    thead.append(...tableObj.getHeaderGroups().map(headerGroup => {
        const rowElement = document.createElement("tr");
        rowElement.append(...headerGroup.headers.map(header => {
            const cellElement = document.createElement("th");
            if(header.column.columnDef.size) {
                cellElement.style.width = header.column.columnDef.size;
            }

            let sortIcon;
            if(header.column.getCanSort()){
                cellElement.style.cursor = 'pointer';
                sortIcon = "fa-solid fa-sort";
                if (header.column.getIsSorted()) {
                    sortIcon = header.column.getIsSorted() === 'asc' ? "fa-solid fa-sort-up" : "fa-solid fa-sort-down";
                }
            }
            cellElement.innerHTML = `
                <div>
                    <span class="mr-1">${flexRender(header.column.columnDef.header, header.getContext())}</span>
                    <i class="fa-sm ${sortIcon}"></i>
                <div>
            `
            cellElement.onclick = header.column.getToggleSortingHandler()
            return cellElement;
        }));
        return rowElement;
    }));
    // 

    tbody.append(...tableObj.getRowModel().rows.map(row => {
        const rowElement = document.createElement("tr");
        rowElement.append(...row.getVisibleCells().map(cell => {
            const cellElement = document.createElement("td");
            const rendered = flexRender(cell.column.columnDef.cell, cell.getContext());
            if(typeof(rendered) == 'string') {
                cellElement.innerHTML = rendered;
            } else {
                cellElement.appendChild(rendered);
            }
            return cellElement;
        }));
        return rowElement;
    }));

    // tfoot.append(...tableObj.getFooterGroups().map(footerGroup => {
    //     const rowElement = document.createElement("tr");
    //     rowElement.append(...footerGroup.headers.map(header => {
    //         const cellElement = document.createElement("th");
    //         cellElement.innerHTML = flexRender(header.column.columnDef.footer, header.getContext());
    //         return cellElement;
    //     }));
    //     return rowElement;
    // }));
    tableElement.append(thead, tbody, tfoot);
    // tableElement.id = rootElementId;
    // rootElement.replaceWith(tableElement);


    function flexRender(renderer, context) {
        // if the content is unsafe, you can sanitize it here
        if (typeof renderer === "function") {
            return renderer(context)??'';
        }
        return renderer??'';
    }
}

function _renderPaginationDOM(pageInfo, tableObj) {
    const pageState = tableObj.getState()?.pagination || {};
    const totalPages = tableObj.getPageCount();
    const totalRows = tableObj.getFilteredRowModel().rows.length;
    const rowMin = pageState.pageIndex * pageState.pageSize + 1
    const rowMax = Math.min((pageState.pageIndex + 1) * pageState.pageSize, totalRows);

    pageInfo.querySelector('.showing-info').innerHTML = `Showing ${rowMin}-${rowMax} of ${totalRows} results`;
    pageInfo.querySelector('.pagination .page-link.first').addEventListener('click', ()=>tableObj.setPageIndex(0));
    pageInfo.querySelector('.pagination .page-link.prev').addEventListener('click', ()=>tableObj.previousPage());
    pageInfo.querySelector('.pagination .page-link.next').addEventListener('click', ()=>tableObj.nextPage());
    pageInfo.querySelector('.pagination .page-link.last').addEventListener('click', ()=>{
        tableObj.setPageIndex(tableObj.getPageCount()-1)
    });

    pageInfo.querySelector('select').value = pageState.pageSize.toString();
    pageInfo.querySelector('select').addEventListener('change', (e)=>{
        tableObj.setPageSize(e.target.value);
    });

    if(pageState.pageIndex != 0) {
        pageInfo.querySelector('.pagination .page-link.first').removeAttribute('disabled')
    }
    if(tableObj.getCanPreviousPage()) {
        pageInfo.querySelector('.pagination .page-link.prev').removeAttribute('disabled')
    }
    if(tableObj.getCanNextPage()) {
        pageInfo.querySelector('.pagination .page-link.next').removeAttribute('disabled')
    }
    if(pageState.pageIndex != totalPages-1) {
        pageInfo.querySelector('.pagination .page-link.last').removeAttribute('disabled')
    }
}

function _renderDOM(container, tableObj, options) {
    const containerEle = document.querySelector(container);
    
    containerEle.innerHTML = `
        <table></table>
        <div class="d-flex align-items-center gap-3 page-info">
            <div class="showing-info me-auto"></div>
            <ul class="pagination pagination-sm m-0">
                <li class="page-item"><a class="page-link first h-100" href="#" disabled><i class="fa-solid fa-angles-left lh-base"></i></a></li>
                <li class="page-item"><a class="page-link prev h-100" href="#" disabled><i class="fa-solid fa-angle-left lh-base"></i></a></li>
                <li class="page-item"><a class="page-link next h-100" href="#" disabled><i class="fa-solid fa-angle-right lh-base"></i></a></li>
                <li class="page-item"><a class="page-link last h-100" href="#" disabled><i class="fa-solid fa-angles-right lh-base"></i></a></li>
            </ul>
            <div class="d-flex gap-1 align-items-center">
                <div>Size</div>
                <div>
                    <select class="form-control form-select form-select-sm">
                        <option value="15">15</option>
                        <option value="30">30</option>
                        <option value="40">40</option>
                        <option value="50">50</option>
                    </select>
                </div>
            </div>
        </div>
    `;

    _renderTableDOM(containerEle.querySelector('table'), tableObj);
    if(options.paginate) {
        _renderPaginationDOM(containerEle.querySelector('.page-info'), tableObj);
    } else {
        containerEle.querySelector('.page-info').remove();
    }
}

const columnHelper = TableCore.createColumnHelper();

function drawCustomTable(container, columns, options) {
    const defaultOptions = {
        paginate: true,
    };

    options = {
        ...defaultOptions, ...options,
    };

    const finalColumns = columns?.map((col)=>(
        columnHelper.accessor(row => row[col.id], col)
    ))
    const tableObj = TableCore.createTable({
        data: [],
        columns: finalColumns,
        getCoreRowModel: TableCore.getCoreRowModel(),
        getSortedRowModel: TableCore.getSortedRowModel(),
        ...(options.paginate ? {getPaginationRowModel: TableCore.getPaginationRowModel()} : {}),
        getFilteredRowModel: TableCore.getFilteredRowModel(),
        state: {
            columnPinning: {},
            pagination: {
                pageIndex: 0,
                pageSize: 15,
            },
            columnFilters: [],
        },
        onStateChange: (foo) => {
            tableObj.setOptions(prev => ({
                ...prev,
                state: foo(tableObj.getState())
            }));
            _renderDOM(container, tableObj, options);
        }
    });

    _renderDOM(container, tableObj, options);


    tableObj.setData = (data)=>{
        tableObj.setOptions((prev)=>({
            ...prev,
            data: data,
        }));
        _renderDOM(container, tableObj, options);
    }

    return tableObj;
}

