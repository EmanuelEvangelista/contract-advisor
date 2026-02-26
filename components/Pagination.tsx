interface PaginationProps {
  page: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (newPage: number) => void;
}

const Pagination = ({
  page,
  pageSize,
  totalItems,
  onPageChange,
}: PaginationProps) => {
  const totalPages = Math.ceil(totalItems / pageSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <section className="container mx-auto flex justify-center items-center my-8">
      <button
        className={`mr-2 px-2 py-1 border border-gray-300 rounded ${
          page === 1
            ? "border-gray-300 text-gray-400 cursor-not-allowed"
            : "border-gray-500 text-black hover:bg-gray-100 cursor-pointer"
        }`}
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
      >
        Previous
      </button>
      <span className="mx-2">
        Page {page} of {totalPages}
      </span>
      <button
        className={`ml-2 px-2 py-1 border rounded
      ${
        page === totalPages
          ? "border-gray-300 text-gray-400 cursor-not-allowed"
          : "border-gray-500 text-black hover:bg-gray-100 cursor-pointer"
      }`}
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
      >
        Next
      </button>
    </section>
  );
};

export default Pagination;
