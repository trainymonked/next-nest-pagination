import { FC, useEffect } from "react";
import Pagination from "react-bootstrap/Pagination";

const SHOW_ONLY_TEN_PAGES = true;

const PaginationComponent: FC<{
  itemsCount: number;
  itemsPerPage: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}> = ({ itemsCount, itemsPerPage, currentPage, setCurrentPage }) => {
  const pagesCount = Math.ceil(itemsCount / itemsPerPage);

  const changePage = (number: number) => {
    if (currentPage === number) return;
    setCurrentPage(number);
  };

  const onPageNumberClick = (pageNumber: number) => {
    changePage(pageNumber);
  };

  const onPreviousPageClick = () => {
    changePage(currentPage - 1);
  };

  const onNextPageClick = () => {
    changePage(currentPage + 1);
  };

  const onFirstPageClick = () => {
    changePage(1);
  };

  const onLastPageClick = () => {
    changePage(pagesCount);
  };

  const setLastPageAsCurrent = () => {
    if (currentPage > pagesCount) {
      setCurrentPage(pagesCount);
    }
  };

  let isPageNumberOutOfRange: boolean;

  const pageNumbers = SHOW_ONLY_TEN_PAGES
    ? [...new Array(10)].map((_, index) => {
        const pageNumber = index + 1;
        return (
          <Pagination.Item
            key={pageNumber}
            onClick={() => onPageNumberClick(pageNumber)}
            active={pageNumber === currentPage}
          >
            {pageNumber}
          </Pagination.Item>
        );
      })
    : [...new Array(pagesCount)].map((_, index) => {
        const pageNumber = index + 1;
        const isPageNumberFirst = pageNumber === 1;
        const isPageNumberLast = pageNumber === pagesCount;
        const isCurrentPageWithinTwoPageNumbers = Math.abs(pageNumber - currentPage) <= 2;

        if (isPageNumberFirst || isPageNumberLast || isCurrentPageWithinTwoPageNumbers) {
          isPageNumberOutOfRange = false;
          return (
            <Pagination.Item
              key={pageNumber}
              onClick={() => onPageNumberClick(pageNumber)}
              active={pageNumber === currentPage}
            >
              {pageNumber}
            </Pagination.Item>
          );
        }

        if (!isPageNumberOutOfRange) {
          isPageNumberOutOfRange = true;
          return <Pagination.Ellipsis key={pageNumber} className="muted" />;
        }

        return null;
      });

  useEffect(setLastPageAsCurrent, [pagesCount]);

  return (
    <Pagination>
      <Pagination.First onClick={onFirstPageClick} />
      <Pagination.Prev onClick={onPreviousPageClick} />
      {pageNumbers}
      <Pagination.Next onClick={onNextPageClick} />
      <Pagination.Last onClick={onLastPageClick} />
    </Pagination>
  );
};

export default PaginationComponent;
