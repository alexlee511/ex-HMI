function check_document(id){
    return Boolean(document.getElementById(id));
}

export function hideIcon(pageNum, maxPageNum) {
    console.log(pageNum, maxPageNum)
    if (pageNum > 2) {
        if(check_document("firstPage"))
            document.getElementById("firstPage").style.opacity = 100;
        if(check_document("previousPage"))
            document.getElementById("previousPage").style.opacity = 100;
    }
    else if (pageNum > 1) {
        if(check_document("firstPage"))
            document.getElementById("firstPage").style.opacity = 0;
        if(check_document("previousPage"))
            document.getElementById("previousPage").style.opacity = 100;
    }
    else {
        if(check_document("firstPage"))
            document.getElementById("firstPage").style.opacity = 0;
        if(check_document("previousPage"))
            document.getElementById("previousPage").style.opacity = 0;
    }

    if (pageNum < maxPageNum - 1) {
        if(check_document("lastPage"))
            document.getElementById("lastPage").style.opacity = 100;
        if(check_document("nextPage"))
            document.getElementById("nextPage").style.opacity = 100;
    }
    else if (pageNum < maxPageNum) {
        if(check_document("lastPage"))
            document.getElementById("lastPage").style.opacity = 0;
        if(check_document("nextPage"))
            document.getElementById("nextPage").style.opacity = 100;
    }
    else {
        if(check_document("lastPage"))
            document.getElementById("lastPage").style.opacity = 0;
        if(check_document("nextPage"))
            document.getElementById("nextPage").style.opacity = 0;
    }
}