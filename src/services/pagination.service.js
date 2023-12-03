function makePaginationService(currentPage, totalPages) {
    const changePage = (page) => {
        if (page >= 1 && page <= totalPages.value) {
            currentPage.value = page;
        }
    };

    const changePageToEllipsis = (ellipsis, index) => {
        const pages = calculatePagesToShow();
        if (ellipsis === '...' && index === 0) {
            changePage(pages[1] - 1);
        } else if (ellipsis === '...' && index === pages.length - 1) {
            changePage(pages[pages.length - 2] + 1);
        }
    };

    const nextPage = () => {
        if (currentPage.value < totalPages.value) {
            currentPage.value++;
        }
    };

    const prevPage = () => {
        if (currentPage.value > 1) {
            currentPage.value--;
        }
    };

    const calculatePagesToShow = () => {
        let pages = [currentPage.value];
        for (let i = 1; i <= 2; i++) {
            if (currentPage.value - i > 0) {
                pages.unshift(currentPage.value - i);
            }
            if (currentPage.value + i <= totalPages.value) {
                pages.push(currentPage.value + i);
            }
        }
        if (currentPage.value - 3 >= 1) {
            pages.unshift('...');
        }
        if (currentPage.value + 3 <= totalPages.value) {
            pages.push('...');
        }
        return pages;
    };

    return {
        changePage,
        changePageToEllipsis,
        nextPage,
        prevPage,
        calculatePagesToShow
    };
}

export default makePaginationService;
