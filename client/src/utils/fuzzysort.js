import { rankItem, compareItems } from "@tanstack/match-sorter-utils";
import { sortingFns } from "@tanstack/table-core";

const parseDate = (dateString) => {
  if (!dateString) return null;
  const [month, day, year] = dateString.split('/');
  return new Date(year, month - 1, day);
};

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

const dateBetweenFilterFn = (row, columnId, value) => {
  const cellValue = row.getValue(columnId);
  const { start, end } = value;

  if (!start && !end) return true;
  if (!cellValue) return false;

  const date = parseDate(cellValue);
  const startDate = parseDate(start);
  const endDate = parseDate(end);

  if (startDate && endDate) {
    return date >= startDate && date <= endDate;
  }
  if (startDate) {
    return date >= startDate;
  }
  if (endDate) {
    return date <= endDate;
  }
  return true;
}

export { fuzzyFilter, fuzzySort, dateBetweenFilterFn };
