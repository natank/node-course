const ITEMS_PER_PAGE = 5;
const LINKS_PER_PAGE = 1;
exports.paginationProps = (allItems, pageToLoad, dir, firstLink, lastLink) => {
  const props = {
    pageToLoad: null,
    totalEntries: null,
    totalNumOfPages: null,
    prevPage: null,
    nextPage: null,
    arrPageItems: null,
    firstLink: null,
    lastLink: null
  }

  props.pageToLoad = pageToLoad ? parseInt(pageToLoad) : 1;
  props.totalEntries = totalEntries(allItems);

  props.totalNumOfPages = totalNumberOfPages(props.totalEntries);

  props.prevPage = props.pageToLoad > 1 ? props.pageToLoad - 1 : 1;
  props.nextPage = props.pageToLoad < props.totalNumOfPages ? props.pageToLoad + 1 : props.totalNumOfPages;


  props.arrPageItems = allItems.slice(
    startIndex(props.pageToLoad),
    startIndex(props.pageToLoad) + ITEMS_PER_PAGE
  )

  // display of the pagination bar

  if (dir === 'l') {
    props.firstLink = parseInt(firstLink) > 1 ? parseInt(firstLink) - 1 : parseInt(firstLink);
    props.lastLink = parseInt(lastLink) > 1 ? parseInt(lastLink) - 1 : parseInt(lastLink);
  } else if (dir === 'r') {
    props.lastLink = parseInt(lastLink) < LINKS_PER_PAGE ? parseInt(lastLink) + 1 : parseInt(lastLink);
    props.firstLink = parseInt(firstLink) < LINKS_PER_PAGE ? parseInt(firstLink) + 1 : firstLink
  } else {
    props.firstLink = 1;
    props.lastLink = 1 + LINKS_PER_PAGE < props.totalNumOfPages ? LINKS_PER_PAGE : props.totalNumOfPages;
  }
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