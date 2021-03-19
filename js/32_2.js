


let color = ['transparent', 'grayscale', 'red', 'orange', 'yellow',
             'green', 'turquoise', 'blue', 'lilac', 'pink',
             'white', 'gray', 'black', 'brown'];

let connectionSting = 'https://pixabay.com/api/?key=13758930-1d93593cd503dcde0b0b6f27b';
let picsPerPage = 100;
let searchArr = $('#select').val();
let typeArr = $('.typeSelector').val();
let categoryArr = $('.categorySelector').val();
let colorArr = $('.colorSelector').val();

$('.-button.search').click(function(){
  console.log(searchData);
  console.log(typeData);
  console.log(categoryData);
  console.log(colorData);
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

// ---------------------------------------------

fetch(connectionSting) // GET
  .then((response) => response.json())
  .then((fullRequest) => {
    console.log (fullRequest);
    fullRequest.hits.forEach((pict) => {
      let deltaID = pict.id;
      let deltaSmallPic = pict.previewURL;
      let deltaBigPic = pict.webformatURL;
      $('.image-gallery').append(`
        <a href="${deltaBigPic}">
          <img alt="${deltaID}" src="${deltaSmallPic}"/>
        </a>
      `);
    });
  })
  .catch((error) => {
  console.log(error);
  });