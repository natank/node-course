const ITEMS_PER_PAGE = 5;

exports.paginationProps = (allItems, pageToLoad) => {
  const props = {}


  props.pageToLoad = pageToLoad ? pageToLoad : 1;
  props.totalEntries = totalEntries(allItems);
  props.totalNumOfPages = totalNumberOfPages(props.totalEntries);
  props.prevPage = props.pageToLoad > 1 ? props.pageToLoad - 1 : 1;
  props.nextPage = props.pageToLoad < props.totalNumOfPages ? props.pageToLoad + 1 : props.totalNumOfPages - 1;

  props.arrPageItems = allItems.slice(
    startIndex(props.pageToLoad),
    startIndex(props.pageToLoad) + ITEMS_PER_PAGE
  )
  return props;
}


totalEntries = (itemsArr) => {
  return itemsArr.length;
}

startIndex = (pageToLoad) => {
  return ITEMS_PER_PAGE * (pageToLoad - 1)
}

totalNumberOfPages = (totalNumberOfItems) => {
  return Math.ceil(totalNumberOfItems / ITEMS_PER_PAGE);
}