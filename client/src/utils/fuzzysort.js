import { rankItem, compareItems } from "@tanstack/match-sorter-utils";
import { sortingFns } from "@tanstack/table-core";

function fuzzyFilter(row, columnId, value, addMeta) {
  const itemRank = rankItem(row.getValue(columnId), value);

  addMeta({
    itemRank,
  });

  return itemRank.passed;
}

function fuzzySort(rowA, rowB, columnId) {
  let dir = 0;

  if (rowA.columnFiltersMeta[columnId]) {
    dir = compareItems(
      rowA.columnFiltersMeta[columnId]?.itemRank,
      rowB.columnFiltersMeta[columnId]?.itemRank,
    );
  }

  return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir;
}

function dateBetweenFilterFn(row, columnId, value) {
  const data = row.getValue(columnId); 
  const { from, to } = value; // Destructure the `from` and `to` dates from the value

  if (!data) return false;

  const rowDate = new Date(data); // Convert the row date to a Date object
  const start = from ? new Date(from) : null; // Convert `from` to a Date object
  const end = to ? new Date(to) : null; // Convert `to` to a Date object

  // Filtering logic
  if (start && !end) {
    return rowDate >= start; 
  } else if (!start && end) {
    return rowDate <= end;
  } else if (start && end) {
    return rowDate >= start && rowDate <= end; // Check within the range
  }

  return true;
}

export { fuzzyFilter, fuzzySort, dateBetweenFilterFn };
