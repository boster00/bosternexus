/**
 * Element templates from new.html
 */

export const elements = {
  buttonOrange: {
    name: 'Orange Button',
    category: 'Buttons',
    html: `<a href="#" class="btn-orange">Orange Button</a>`
  },
  buttonOrangeWithIcon: {
    name: 'Orange Button With Icon',
    category: 'Buttons',
    html: `<a href="#" class="btn-orange"><i class="fas fa-times mr-2"></i> Orange Button With Icon</a>`
  },
  buttonOutlineOrange: {
    name: 'Orange Outline Button',
    category: 'Buttons',
    html: `<a href="#" class="btn-outline-orange">Orange Button</a>`
  },
  buttonBlue: {
    name: 'Blue Button',
    category: 'Buttons',
    html: `<a href="#" class="btn-blue">Blue Button</a>`
  },
  buttonBlueWithIcon: {
    name: 'Blue Button With Icon',
    category: 'Buttons',
    html: `<a href="#" class="btn-blue"><i class="fas fa-times mr-2"></i> Blue Button With Icon</a>`
  },
  buttonOutlineBlue: {
    name: 'Blue Outline Button',
    category: 'Buttons',
    html: `<a href="#" class="btn-outline-blue">Blue Button</a>`
  },
  buttonWhite: {
    name: 'White Button',
    category: 'Buttons',
    html: `<a href="#" class="btn-white">White Button</a>`
  },
  buttonOutlineWhite: {
    name: 'White Outline Button',
    category: 'Buttons',
    html: `<a href="#" class="btn-outline-white">White Button</a>`
  },
  buttonSuccess: {
    name: 'Success Button',
    category: 'Buttons',
    html: `<a href="#" class="btn-success">Success Button</a>`
  },
  buttonDanger: {
    name: 'Danger Button',
    category: 'Buttons',
    html: `<a href="#" class="btn-danger">Danger Button</a>`
  },
  tableStriped: {
    name: 'Striped Table',
    category: 'Tables',
    html: `<table class="table table-striped">
  <thead class="bg-grey text-white">
    <tr>
      <th>Cell Name</th>
      <th>Location</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Some Cell Value Here</th>
      <td>Bone</td>
    </tr>
    <tr>
      <th>Other Cell Value Here</th>
      <td>Throat</td>
    </tr>
    <tr>
      <th>One Last Cell Value</th>
      <td>Really Long Location Value Here</td>
    </tr>
  </tbody>
</table>`
  },
  tableSimple: {
    name: 'Simple Table',
    category: 'Tables',
    html: `<table class="table table-striped">
  <tbody>
    <tr>
      <th class="font-weight-bold">SKU:</th>
      <td>PB90394</td>
    </tr>
    <tr>
      <th class="font-weight-bold">Size:</th>
      <td>100µg/vial</td>
    </tr>
    <tr>
      <th class="font-weight-bold">Reactivity:</th>
      <td>Human , Mouse , Rat</td>
    </tr>
    <tr>
      <th class="font-weight-bold">Host:</th>
      <td>Rabbit</td>
    </tr>
    <tr>
      <th class="font-weight-bold">Applications:</th>
      <td>Flow Cytometry , IHC,ICC,WB</td>
    </tr>
  </tbody>
</table>`
  },
  unorderedList: {
    name: 'Unordered List',
    category: 'Lists',
    html: `<ul class="list-unstyled">
  <li class="mb-2"><a href="#">Primary Antibodies</a></li>
  <li class="mb-2"><a href="#">Secondary Antibodies</a></li>
  <li class="mb-2"><a href="#">Picokine™ ELISA Kits</a></li>
</ul>`
  },
  orderedList: {
    name: 'Ordered List',
    category: 'Lists',
    html: `<ol>
  <li class="mb-2">First item</li>
  <li class="mb-2">Second item</li>
  <li class="mb-2">Third item</li>
</ol>`
  },
  cardText: {
    name: 'Text Card',
    category: 'Cards',
    html: `<div class="bg-light p-4 border-rounded">
  <h3 class="text-orange font-large">Text card</h3>
  <p>This card is good for featuring some textual contents in plain format. Usually such text should be rather long to make the height of the card close to or longer than its width.</p>
  <a href="#" class="d-block btn-orange">Remove Button if not needed</a>
</div>`
  },
  cardWithIcon: {
    name: 'Card With Icon',
    category: 'Cards',
    html: `<div class="bg-white p-4 border-rounded border mx-auto text-center">
  <h3 class="text-orange font-large">Card With Icon</h3>
  <div class="medium-icon-container bg-orange">
    <i class="fas fa-times"></i>
  </div>
  <p>This type of card is perfect to showcase sub topics or features.</p>
  <a href="#" class="d-block btn-orange">Remove Button if not needed</a>
</div>`
  },
  cardWithImage: {
    name: 'Card With Image',
    category: 'Cards',
    html: `<div class="bg-white p-4 border-rounded border mx-auto text-center">
  <h3 class="text-orange font-large">Card With Image</h3>
  <img src="https://www.bosterbio.com/media/images/placeholder.jpg" alt="Some Text" title="Some Other Text" class="mb-3" width="120" height="120">
  <p>If the image does not exist on the website, please include some reference here to tell the designer what the image should be.</p>
  <a href="#" class="d-block btn-orange">Remove Button if not needed</a>
</div>`
  },
  headingH1: {
    name: 'Heading H1',
    category: 'Typography',
    html: `<h1 class="mb-2">Heading 1</h1>`
  },
  headingH2: {
    name: 'Heading H2',
    category: 'Typography',
    html: `<h2 class="mb-2">Heading 2</h2>`
  },
  headingH3: {
    name: 'Heading H3',
    category: 'Typography',
    html: `<h3 class="mb-2">Heading 3</h3>`
  },
  paragraph: {
    name: 'Paragraph',
    category: 'Typography',
    html: `<p>Paragraph text goes here. You can edit this content.</p>`
  },
  link: {
    name: 'Link',
    category: 'Typography',
    html: `<a href="#">Link Text</a>`
  },
  image: {
    name: 'Image',
    category: 'Media',
    html: `<img src="https://www.bosterbio.com/media/images/placeholder.jpg" alt="Image description" class="mb-3">`
  }
};

// Get elements grouped by category
export function getElementsByCategory() {
  const grouped = {};
  Object.values(elements).forEach(element => {
    if (!grouped[element.category]) {
      grouped[element.category] = [];
    }
    grouped[element.category].push(element);
  });
  return grouped;
}

// Get all element categories
export function getElementCategories() {
  return Object.keys(getElementsByCategory());
}
