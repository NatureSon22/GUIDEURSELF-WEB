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

export { fuzzyFilter, fuzzySort };