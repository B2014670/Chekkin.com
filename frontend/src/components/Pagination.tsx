export type Props = {
  page: number;
  pages: number;
  onPageChange: (page: number) => void;
};

const Pagination = ({ page, pages, onPageChange }: Props) => {

  const pageNumbers = [];
  for (let i = 1; i <= pages; i++) {
    pageNumbers.push(i);
  }
  return (
    <div className="flex justify-center">

      {pages > 1 &&
        <div className="flex border border-slate-300 rounded">
          {pageNumbers.map((number) => (
            <button
              onClick={() => onPageChange(number)}
              className=
              {`px-3 py-1 text-blue-600 text-lg ${page === number
                ? "bg-blue-600 hover:bg-blue-500 text-white rounded"
                : ""}`
              }
            >
              {number}
            </button>

          ))
          }
        </div>
      }

      {pages === 0 &&
        <p className="text-2xl border-0 border-none">Not found</p>
      }

    </div>


  );
}

export default Pagination