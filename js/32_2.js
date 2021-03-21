
const connectionSting = 'https://pixabay.com/api/?key=13758930-1d93593cd503dcde0b0b6f27b';
const picsPerPage = 300;


$('.-button.search').click(function(){
  let searchStr = ('&q=' + $('.gl-search').val());
  let typeStr = ('&image_type=' + $('.typeSelector').val().join('+'));
  let categoryStr = ('&category=' + $('.categorySelector').val().join('+'));
  let colorStr = ('&colors=' + getColorsSelect().join('+'));

  let queryStr = connectionSting + searchStr + typeStr + categoryStr + colorStr + "per_page=" + picsPerPage;

  getPicture(queryStr);

});


// --- Form control --------------------
$(function () {
  $(`.-button.ext`).click(function() {
    $(`.ext-panel`).slideToggle();
  });
})

$(function closeUserForm(){
  $(document).mouseup(function (event){
    if (!$(event.target).hasClass(`ext-status`)
        && !$(event.target).parents(`.ext-status`).length) {
      $(`.ext-panel`).slideUp(350);
    }
  });
});

function getColorsSelect() {
  let arr = [];
  $('.colorcheck:checked').each(function() {
    arr.push($(this).val());
  });
  return arr;
}


// TODO http://slimselectjs.com/

let typeSelector = new SlimSelect({
    select: '.typeSelector',
    placeholder: 'Select image type',
    showSearch: false,
})

let categorySelector = new SlimSelect({
  select: '.categorySelector',
  placeholder: 'Select image type',
  showSearch: false,
})
// ----------------------------------

function getPicture(fullRequest) {
  fetch(fullRequest) // GET
    .then((response) => response.json())
    .then((fullRequest) => {
      console.log (fullRequest);
      fullRequest.hits.forEach((pict) => {
        let deltaID = pict.id;
        let deltaSmallPic = pict.previewURL;
        let deltaBigPic = pict.webformatURL;
        $('.gallery').append(`
          <a href="${deltaBigPic}">
            <img alt="${deltaID}" src="${deltaSmallPic}"/>
          </a>
        `);
      });
    })
    .catch((error) => {
    console.log(error);
    });
}

//   $('#gallery').justifiedGallery({
//     rowHeight: 150,
//     maxRowHeight:	200,
//     maxRowsCount:	0,
//     lastRow: 'center',
//     captions:	true,
//     margins: 7,
//     waitThumbnailsLoad:	true,
// });
