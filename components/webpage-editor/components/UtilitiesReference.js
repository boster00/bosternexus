'use client';

/**
 * UtilitiesReference - Full scrollable guide for Effects/Utilities
 * Displays comprehensive style guide with colors, fonts, spacing, buttons, etc.
 */
export default function UtilitiesReference() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Colors Section */}
      <section className="mb-8" id="colors-classes">
        <h2 className="text-3xl font-bold mb-4">Colors</h2>
        <p className="text-center mb-4">The Color Scheme of the website and the usage of it.</p>
        
        <h4 className="text-xl font-semibold mb-3">Text Colors</h4>
        <p className="mb-4">The following classes are meant to be used on a text, they won't affect the actual background of the element</p>
        
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Code</th>
                <th className="border p-2">Color Info</th>
                <th className="border p-2">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Orange</td>
                <td className="border p-2"><code>text-orange</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="text-orange"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><a href="https://www.color-hex.com/color/ea8d28" target="_blank" rel="noopener noreferrer" className="text-orange-600 underline">#ea8d28</a></td>
                <td className="border p-2"><p className="text-orange-600">Orange Text</p></td>
              </tr>
              <tr>
                <td className="border p-2">Blue</td>
                <td className="border p-2"><code>text-blue</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="text-blue"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><a href="https://www.color-hex.com/color/3ca9d6" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">#3ca9d6</a></td>
                <td className="border p-2"><p className="text-blue-500">Blue Text</p></td>
              </tr>
              <tr>
                <td className="border p-2">Dark Grey</td>
                <td className="border p-2"><code>text-darkgrey</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="text-darkgrey"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><a href="https://www.color-hex.com/color/434343" target="_blank" rel="noopener noreferrer" className="text-gray-700 underline">#434343</a></td>
                <td className="border p-2"><p className="text-gray-700">Dark Grey Text</p></td>
              </tr>
              <tr>
                <td className="border p-2">Medium Grey</td>
                <td className="border p-2"><code>text-midgrey</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="text-midgrey"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><a href="https://www.color-hex.com/color/878787" target="_blank" rel="noopener noreferrer" className="text-gray-500 underline">#878787</a></td>
                <td className="border p-2"><p className="text-gray-500">Medium Grey Text</p></td>
              </tr>
              <tr>
                <td className="border p-2">Grey</td>
                <td className="border p-2"><code>text-grey</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="text-grey"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><a href="https://www.color-hex.com/color/a9a9a9" target="_blank" rel="noopener noreferrer" className="text-gray-400 underline">#6d6d6d</a></td>
                <td className="border p-2"><p className="text-gray-400">Grey Text</p></td>
              </tr>
              <tr>
                <td className="border p-2">Light Grey</td>
                <td className="border p-2"><code>text-lightgrey</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="text-lightgrey"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><a href="https://www.color-hex.com/color/f2f2f2" target="_blank" rel="noopener noreferrer" className="bg-gray-800 text-gray-200 px-2 py-1 rounded underline">#f2f2f2</a></td>
                <td className="border p-2"><p className="text-gray-200 bg-gray-800 p-2 rounded">Light Grey Text</p></td>
              </tr>
              <tr>
                <td className="border p-2">Danger</td>
                <td className="border p-2"><code>text-danger</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="text-danger"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><a href="https://www.color-hex.com/color/bf3535" target="_blank" rel="noopener noreferrer" className="text-red-600 underline">#bf3535</a></td>
                <td className="border p-2"><p className="text-red-600">Danger Text</p></td>
              </tr>
              <tr>
                <td className="border p-2">Success</td>
                <td className="border p-2"><code>text-success</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="text-success"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><a href="https://www.color-hex.com/color/3cbf35" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">#3cbf35</a></td>
                <td className="border p-2"><p className="text-green-600">Success Text</p></td>
              </tr>
            </tbody>
          </table>
        </div>

        <h4 className="text-xl font-semibold mt-6 mb-3">Background Colors</h4>
        <p className="mb-4">The following classes are meant to be used on a block, they won't affect the actual text color of the element</p>
        
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Code</th>
                <th className="border p-2">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Orange</td>
                <td className="border p-2"><code>bg-orange</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="bg-orange"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p className="bg-orange-500 p-2 text-white rounded">Orange Background</p></td>
              </tr>
              <tr>
                <td className="border p-2">Blue</td>
                <td className="border p-2"><code>bg-blue</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="bg-blue"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p className="bg-blue-500 p-2 text-white rounded">Blue Background</p></td>
              </tr>
              <tr>
                <td className="border p-2">Dark Grey</td>
                <td className="border p-2"><code>bg-darkgrey</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="bg-darkgrey"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p className="bg-gray-800 p-2 text-white rounded">Dark Grey Background</p></td>
              </tr>
              <tr>
                <td className="border p-2">Medium Grey</td>
                <td className="border p-2"><code>bg-midgrey</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="bg-midgrey"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p className="bg-gray-500 p-2 text-white rounded">Medium Grey Background</p></td>
              </tr>
              <tr>
                <td className="border p-2">Grey</td>
                <td className="border p-2"><code>bg-grey</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="bg-grey"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p className="bg-gray-400 p-2 text-white rounded">Grey Background</p></td>
              </tr>
              <tr>
                <td className="border p-2">Light Grey</td>
                <td className="border p-2"><code>bg-lightgrey</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="bg-lightgrey"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p className="bg-gray-200 p-2 rounded">Light Grey Background</p></td>
              </tr>
              <tr>
                <td className="border p-2">Danger</td>
                <td className="border p-2"><code>bg-danger</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="bg-danger"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p className="bg-red-600 p-2 text-white rounded">Danger Background</p></td>
              </tr>
              <tr>
                <td className="border p-2">Success</td>
                <td className="border p-2"><code>bg-success</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="bg-success"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p className="bg-green-600 p-2 text-white rounded">Success Background</p></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Cutoff Section */}
      <section className="mb-8" id="cutoff">
        <h2 className="text-3xl font-bold mb-4">Cutoff</h2>
        <p className="text-center mb-4">The cutoff mechanism is meant to display long content in a better way</p>
        <p className="mb-4">
          The cutoff usage consists of two classes, <kbd className="bg-gray-200 px-2 py-1 rounded">.cutoff</kbd> &amp; <kbd className="bg-gray-200 px-2 py-1 rounded">.cutoff-point</kbd>, 
          the .cutoff is the parent element container and the .cutoff-point is where the content should be hidden
        </p>
        <p className="font-bold mb-2">Code Sample:</p>
        <pre className="bg-gray-800 text-gray-100 p-4 rounded mb-4 overflow-x-auto">
{`<div class="cutoff">
    ...
    <span class="cutoff-point"></span>
    ....
</div>`}
        </pre>
        <p className="font-bold mb-2">Example:</p>
        <div className="cutoff mb-6 border border-gray-300 p-4 rounded">
          <p className="text-gray-600">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
          <span className="cutoff-point"></span>
          <div className="text-center mt-4">
            <a href="#!" className="btn btn-primary">Read More</a>
          </div>
        </div>
        <p className="font-bold mb-2">Important Usage Rules:</p>
        <p>The <kbd className="bg-gray-200 px-2 py-1 rounded">.cutoff-point</kbd> item should be a direct child of <kbd className="bg-gray-200 px-2 py-1 rounded">.cutoff</kbd> element</p>
      </section>

      {/* Font Sizes Section */}
      <section className="mb-8" id="font-sizes">
        <h2 className="text-3xl font-bold mb-4">Font Sizes</h2>
        <p className="text-center mb-4">The following classes control the text sizing based on the predefined size classes</p>
        
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Code</th>
                <th className="border p-2">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Smaller</td>
                <td className="border p-2"><code>font-smaller</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="font-smaller"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p className="text-xs">Smaller Size</p></td>
              </tr>
              <tr>
                <td className="border p-2">Small</td>
                <td className="border p-2"><code>font-small</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="font-small"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p className="text-sm">Small Size</p></td>
              </tr>
              <tr>
                <td className="border p-2">medium</td>
                <td className="border p-2"><code>font-medium</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="font-medium"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p className="text-base">medium Size</p></td>
              </tr>
              <tr>
                <td className="border p-2">Large</td>
                <td className="border p-2"><code>font-large</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="font-large"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p className="text-lg">Large Size</p></td>
              </tr>
              <tr>
                <td className="border p-2">Larger</td>
                <td className="border p-2"><code>font-larger</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="font-larger"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p className="text-xl">Larger Size</p></td>
              </tr>
              <tr>
                <td className="border p-2">Largest</td>
                <td className="border p-2"><code>font-largest</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="font-largest"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p className="text-2xl">Largest Size</p></td>
              </tr>
              <tr>
                <td className="border p-2">Default h1</td>
                <td className="border p-2">none</td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;h1&gt;...&lt;/h1&gt;</kbd></td>
                <td className="border p-2"><h1>Heading</h1></td>
              </tr>
              <tr>
                <td className="border p-2">Default h2</td>
                <td className="border p-2">none</td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;h2&gt;...&lt;/h2&gt;</kbd></td>
                <td className="border p-2"><h2>Heading</h2></td>
              </tr>
              <tr>
                <td className="border p-2">Default h3</td>
                <td className="border p-2">none</td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;h3&gt;...&lt;/h3&gt;</kbd></td>
                <td className="border p-2"><h3>Heading</h3></td>
              </tr>
              <tr>
                <td className="border p-2">Default h4</td>
                <td className="border p-2">none</td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;h4&gt;...&lt;/h4&gt;</kbd></td>
                <td className="border p-2"><h4>Heading</h4></td>
              </tr>
              <tr>
                <td className="border p-2">Default h5</td>
                <td className="border p-2">none</td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;h5&gt;...&lt;/h5&gt;</kbd></td>
                <td className="border p-2"><h5>Heading</h5></td>
              </tr>
              <tr>
                <td className="border p-2">Default p</td>
                <td className="border p-2">none</td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p>Heading</p></td>
              </tr>
              <tr>
                <td className="border p-2">Default Font Size</td>
                <td className="border p-2">none</td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p>Paragraph</p></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* List Styles Section */}
      <section className="mb-8" id="list-styles">
        <h2 className="text-3xl font-bold mb-4">List Styles</h2>
        <p className="text-center mb-4">The following classes control the list style based on the predefined size classes</p>
        
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Code</th>
                <th className="border p-2">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Numbers</td>
                <td className="border p-2"><code>list-style-numbers</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;ol class="list-style-numbers"&gt;...&lt;/ol&gt;</kbd></td>
                <td className="border p-2">
                  <ol className="list-decimal list-inside">
                    <li>List Item</li>
                  </ol>
                </td>
              </tr>
              <tr>
                <td className="border p-2">Roman</td>
                <td className="border p-2"><code>list-style-roman</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;ol class="list-style-roman"&gt;...&lt;/ol&gt;</kbd></td>
                <td className="border p-2">
                  <ol className="list-[lower-roman] list-inside">
                    <li>List Item</li>
                  </ol>
                </td>
              </tr>
              <tr>
                <td className="border p-2">Alphabetical</td>
                <td className="border p-2"><code>list-style-alpha</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;ol class="list-style-alpha"&gt;...&lt;/ol&gt;</kbd></td>
                <td className="border p-2">
                  <ol className="list-[upper-alpha] list-inside">
                    <li>List Item</li>
                  </ol>
                </td>
              </tr>
              <tr>
                <td className="border p-2">Lower Case Alphabetical</td>
                <td className="border p-2"><code>list-style-alpha-lower</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;ol class="list-style-alpha-lower"&gt;...&lt;/ol&gt;</kbd></td>
                <td className="border p-2">
                  <ol className="list-[lower-alpha] list-inside">
                    <li>List Item</li>
                  </ol>
                </td>
              </tr>
              <tr>
                <td className="border p-2">Greek</td>
                <td className="border p-2"><code>list-style-greek</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;ol class="list-style-greek"&gt;...&lt;/ol&gt;</kbd></td>
                <td className="border p-2">
                  <ol className="list-[lower-greek] list-inside">
                    <li>List Item</li>
                  </ol>
                </td>
              </tr>
              <tr>
                <td className="border p-2">Bullets</td>
                <td className="border p-2"><code>list-style-bullets</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;ul class="list-style-bullets"&gt;...&lt;/ul&gt;</kbd></td>
                <td className="border p-2">
                  <ul className="list-disc list-inside">
                    <li>List Item</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="border p-2">Circles</td>
                <td className="border p-2"><code>list-style-circles</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;ul class="list-style-circles"&gt;...&lt;/ul&gt;</kbd></td>
                <td className="border p-2">
                  <ul className="list-[circle] list-inside">
                    <li>List Item</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td className="border p-2">Squares</td>
                <td className="border p-2"><code>list-style-squares</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;ul class="list-style-squares"&gt;...&lt;/ul&gt;</kbd></td>
                <td className="border p-2">
                  <ul className="list-[square] list-inside">
                    <li>List Item</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Text Alignment Section */}
      <section className="mb-8" id="text-alignment">
        <h2 className="text-3xl font-bold mb-4">Text Alignment</h2>
        <p className="text-center mb-4">The following classes control the text alignment</p>
        
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Code</th>
                <th className="border p-2">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Left (Default)</td>
                <td className="border p-2"><code>text-left</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="text-left"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p className="text-left border p-2">Left Aligned Text</p></td>
              </tr>
              <tr>
                <td className="border p-2">Center</td>
                <td className="border p-2"><code>text-center</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="text-center"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p className="text-center border p-2">Center Aligned Text</p></td>
              </tr>
              <tr>
                <td className="border p-2">Right</td>
                <td className="border p-2"><code>text-right</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="text-right"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p className="text-right border p-2">Right Aligned Text</p></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Items Alignment Section */}
      <section className="mb-8" id="items-alignment">
        <h2 className="text-3xl font-bold mb-4">Items Alignment</h2>
        <p className="text-center mb-4">The following classes control the items alignment on the screen, it's important to notice that all the content should be in a parent container.</p>
        
        <h4 className="text-xl font-semibold mb-3">Horizontal Center Alignment</h4>
        <p className="mb-4">No matter the width of the container or the elements, the element will always be in the center.</p>
        <kbd className="block bg-gray-100 p-3 rounded mb-4">
          <code className="text-sm">
            {`<div class="horizontal-center">
  <div>
    <img src="/media/images/placeholder.jpg" alt="Alt" title="Title">
  </div>
</div>`}
          </code>
        </kbd>
        <h4 className="my-4 text-lg font-semibold">Result</h4>
        <div className="flex justify-center mb-5 bg-orange-500 p-4 rounded">
          <div>
            <div className="w-16 h-16 bg-gray-300 rounded"></div>
          </div>
        </div>

        <h4 className="text-xl font-semibold mb-3">Vertical Center Alignment</h4>
        <p className="mb-4">No matter the height of the container or the elements, the element will always be in the center.</p>
        <kbd className="block bg-gray-100 p-3 rounded mb-4">
          <code className="text-sm">
            {`<div class="vertical-center">
  <div>
    <img src="/media/images/placeholder.jpg" alt="Alt" title="Title">
  </div>
</div>`}
          </code>
        </kbd>
        <h4 className="mt-4 text-lg font-semibold">Result</h4>
        <div className="flex items-center justify-center bg-orange-500 rounded" style={{ height: '250px' }}>
          <div>
            <div className="w-16 h-16 bg-gray-300 rounded"></div>
          </div>
        </div>
      </section>

      {/* Background Positions Section */}
      <section className="mb-8" id="background-positions">
        <h2 className="text-3xl font-bold mb-4">Background Positions</h2>
        <p className="text-center mb-4">The following classes control the position of an item with background-image property</p>
        
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Code</th>
                <th className="border p-2">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Top</td>
                <td className="border p-2"><code>background-top</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;section class="background-top"&gt;...&lt;/section&gt;</kbd></td>
                <td className="border p-2"><p>Background Image Positioned Top</p></td>
              </tr>
              <tr>
                <td className="border p-2">Right</td>
                <td className="border p-2"><code>background-right</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;section class="background-right"&gt;...&lt;/section&gt;</kbd></td>
                <td className="border p-2"><p>Background Image Positioned Right</p></td>
              </tr>
              <tr>
                <td className="border p-2">Bottom</td>
                <td className="border p-2"><code>background-bottom</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;section class="background-bottom"&gt;...&lt;/section&gt;</kbd></td>
                <td className="border p-2"><p>Background Image Positioned Bottom</p></td>
              </tr>
              <tr>
                <td className="border p-2">Left</td>
                <td className="border p-2"><code>background-left</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;section class="background-left"&gt;...&lt;/section&gt;</kbd></td>
                <td className="border p-2"><p>Background Image Positioned Left</p></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Font Style Section */}
      <section className="mb-8" id="font-style">
        <h2 className="text-3xl font-bold mb-4">Font Style</h2>
        <p className="text-center mb-4">The following classes control the font style variations</p>
        
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Code</th>
                <th className="border p-2">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Uppercase</td>
                <td className="border p-2"><code>text-uppercase</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="text-uppercase"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p className="uppercase">All Capital Case</p></td>
              </tr>
              <tr>
                <td className="border p-2">Lowercase</td>
                <td className="border p-2"><code>text-lowercase</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="text-lowercase"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p className="lowercase">All Lower case</p></td>
              </tr>
              <tr>
                <td className="border p-2">Capitalize</td>
                <td className="border p-2"><code>text-capitalize</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="text-capitalize"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p className="capitalize">text capitalized</p></td>
              </tr>
              <tr>
                <td className="border p-2">Bold</td>
                <td className="border p-2"><code>font-weight-bold</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="font-weight-bold"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p className="font-bold">Bolded Font</p></td>
              </tr>
              <tr>
                <td className="border p-2">Italic</td>
                <td className="border p-2"><code>font-italic</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="font-italic"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2"><p className="italic">Italic Font</p></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Spacing Section */}
      <section className="mb-8" id="spacing">
        <h2 className="text-3xl font-bold mb-4">Spacing</h2>
        <p className="text-center mb-4">The following classes control the elements spacing</p>
        
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Code</th>
                <th className="border p-2">Result</th>
              </tr>
            </thead>
            <tbody>
              {[0, 1, 2, 3, 4, 5].map((num) => (
                <tr key={`padding-${num}`}>
                  <td className="border p-2">Padding</td>
                  <td className="border p-2"><code>p-{num}</code></td>
                  <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="p-{num}"&gt;...&lt;/p&gt;</kbd></td>
                  <td className="border p-2">
                    <p className={`bg-orange-500 text-white rounded`} style={{ padding: `${num * 5}px` }}>
                      Padding {num}
                    </p>
                  </td>
                </tr>
              ))}
              {[0, 1, 2, 3, 4, 5].map((num) => (
                <tr key={`margin-${num}`}>
                  <td className="border p-2">Margin</td>
                  <td className="border p-2"><code>m-{num}</code></td>
                  <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="m-{num}"&gt;...&lt;/p&gt;</kbd></td>
                  <td className="border p-2">
                    <div className="border">
                      <p className={`bg-orange-500 text-white rounded`} style={{ margin: `${num * 5}px` }}>
                        Margin {num}
                      </p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-gray-600">
          There are more ways to use these classes, that will help to add a margin to one side only like mt-2 which will add margin to the top only, 
          to get a more detailed information about this topic please refer to{' '}
          <a href="https://getbootstrap.com/docs/4.4/utilities/spacing/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
            this link
          </a>
        </p>
      </section>

      {/* Sizing Section */}
      <section className="mb-8" id="sizing">
        <h2 className="text-3xl font-bold mb-4">Sizing</h2>
        <p className="text-center mb-4">The following classes control the elements size (width &amp; height)</p>
        
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Code</th>
                <th className="border p-2">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Height %</td>
                <td className="border p-2"><code>h-{'{number}'}</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="h-50"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2" style={{ height: '100px' }}>
                  <p className="h-1/2 bg-orange-500 text-white rounded flex items-center justify-center">Height 50% of Parent Element</p>
                </td>
              </tr>
              <tr>
                <td className="border p-2">Height Pixels</td>
                <td className="border p-2"><code>h-{'{number}'}-px</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="h-50-px"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2">
                  <p className="bg-orange-500 text-white rounded flex items-center justify-center" style={{ height: '50px' }}>Height 50px</p>
                </td>
              </tr>
              <tr>
                <td className="border p-2">Width %</td>
                <td className="border p-2"><code>w-{'{number}'}</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="w-50"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2" style={{ width: '250px' }}>
                  <p className="w-1/2 bg-orange-500 text-white rounded flex items-center justify-center">Width 50% of Parent Element</p>
                </td>
              </tr>
              <tr>
                <td className="border p-2">Width Pixels</td>
                <td className="border p-2"><code>w-{'{number}'}-px</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;p class="w-50-px"&gt;...&lt;/p&gt;</kbd></td>
                <td className="border p-2">
                  <p className="bg-orange-500 text-white rounded flex items-center justify-center" style={{ width: '50px' }}>Width 50px</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Tooltip Section */}
      <section className="mb-8" id="tooltip">
        <h2 className="text-3xl font-bold mb-4">Tooltip</h2>
        <p className="text-center mb-4">Used to display extra information upon hovering an item.</p>
        
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Code</th>
                <th className="border p-2">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Text Tooltip</td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;button data-toggle="tooltip" data-placement="top" title="Tooltip on top" class="bg-orange"&gt;...&lt;/button&gt;</kbd></td>
                <td className="border p-2">
                  <button className="btn btn-primary" title="Tooltip on top">Text Tooltip</button>
                </td>
              </tr>
              <tr>
                <td className="border p-2">HTML Tooltip</td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;button data-toggle="tooltip" data-html="true" data-placement="top" title="&lt;em&gt;Tooltip&lt;/em&gt; &lt;u&gt;with&lt;/u&gt; &lt;b&gt;HTML&lt;/b&gt;" class="bg-orange"&gt;...&lt;/button&gt;</kbd></td>
                <td className="border p-2">
                  <button className="btn btn-primary" title="Tooltip with HTML">HTML Tooltip</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Buttons Section */}
      <section className="mb-8" id="buttons">
        <h2 className="text-3xl font-bold mb-4">Buttons</h2>
        <p className="text-center mb-4">The following classes must be used on a clickable elements, the colors of the button can be controlled based on the text that follows .btn-{'{color}'}</p>
        
        <div className="overflow-x-auto">
          <table className="table w-full border-collapse">
            <thead>
              <tr>
                <th className="border p-2">Name</th>
                <th className="border p-2">Class</th>
                <th className="border p-2">Code</th>
                <th className="border p-2">Result</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border p-2">Button</td>
                <td className="border p-2"><code>btn-orange</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;a class="btn-orange" href="#" &gt;...&lt;/a&gt;</kbd></td>
                <td className="border p-2"><a href="#!" className="btn btn-primary">Button</a></td>
              </tr>
              <tr>
                <td className="border p-2">Button With icon</td>
                <td className="border p-2"><code>btn-orange</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;a class="btn-orange" href="#" &gt;&lt;i class="fas fa-times"&gt;&lt;/i&gt;...&lt;/a&gt;</kbd></td>
                <td className="border p-2"><a href="#!" className="btn btn-primary">✕ Button</a></td>
              </tr>
              <tr>
                <td className="border p-2">Large Button</td>
                <td className="border p-2"><code>btn-lg</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;a class="btn-orange btn-lg" href="#" &gt;...&lt;/a&gt;</kbd></td>
                <td className="border p-2"><a href="#!" className="btn btn-primary btn-lg">Large Button</a></td>
              </tr>
              <tr>
                <td className="border p-2">Full Width Button</td>
                <td className="border p-2"><code>btn-full-width</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;a class="btn-orange btn-full-width" href="#" &gt;...&lt;/a&gt;</kbd></td>
                <td className="border p-2"><a href="#!" className="btn btn-primary w-full">Full Width Button</a></td>
              </tr>
              <tr>
                <td className="border p-2">Button Outline</td>
                <td className="border p-2"><code>btn-outline-white</code></td>
                <td className="border p-2"><kbd className="bg-gray-100 px-2 py-1 rounded">&lt;a class="btn-outline-white" href="#" &gt;...&lt;/a&gt;</kbd></td>
                <td className="border p-2 bg-orange-500 p-3 rounded">
                  <a href="#!" className="btn btn-outline btn-ghost text-white border-white hover:bg-white hover:text-orange-500">Button Outline White</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Popup Form Button Section */}
      <section className="mb-8" id="popup-form-button">
        <h2 className="text-3xl font-bold mb-4">Popup Form Button</h2>
        <p className="text-center mb-4">One button that contains all the info of a button, clicking which will generate a form</p>
        <p className="text-sm text-gray-600 mb-4">
          This is a specialized button component that requires JavaScript functionality to generate forms dynamically. 
          Refer to the original implementation for the complete popupForm function.
        </p>
      </section>
    </div>
  );
}

