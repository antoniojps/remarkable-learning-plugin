import React from 'react';
import './App.css';

import { Remarkable } from 'remarkable';
import logo from './../src/logo.svg'
import carousel from './../src/carousel'
const md = new Remarkable({ html: true, xhtmlOut: true });
md.use(carousel)
const markdown = `
# Carousel should be below

<carousel>
  ![Cantina de Crasto](contents/imgs/spaces/espacos_cantina_crasto_3.jpg "Cantina do Crasto")
  ![Cantina de Crasto](contents/imgs/spaces/espacos_cantina_crasto_2.jpg "Cantina do Crasto")
  ![Cantina de Crasto](contents/imgs/spaces/espacos_cantina_crasto_4.jpg "Cantina do Crasto")
  ![Cantina de Santiago](contents/imgs/spaces/espacos_cantina_santiago.jpg "Cantina de Santiago")
  ![Cantina de Santiago](contents/imgs/spaces/espacos_cantina_santiago_4.jpg "Cantina de Santiago (grelhados)")
  ![Cantina de Santiago, Linha verde](contents/imgs/spaces/espacos_cantina_linha_verde.jpg "Cantina de Santiago (linha verde)")
</carousel>

wadduheck

**hehehe** tudo bem?
`
const html = md.render(markdown)

function App() {

  const markdownHTML = {
    __html:  html
  }


  return (
    <div className="App">
      <div
        className="content"
        dangerouslySetInnerHTML={markdownHTML}
      />
    </div>
  );
}

export default App;
