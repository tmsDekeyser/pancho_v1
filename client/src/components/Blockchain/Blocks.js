import React, { Component } from 'react';
import { Button, FormGroup, FormControl, FormLabel } from 'react-bootstrap';
import Block from './Block';
import Navigation from '../Navbar';

const BLOCKS_PER_PAGE = 5;

class Blocks extends Component {
  constructor() {
    super();
    this.state = { chain: [], pageNumber: 0, inputBlockNo: 0 };
  }

  componentDidMount() {
    fetch('http://localhost:3001/api/v0/p2p/blocks')
      .then((response) => response.json())
      .then((data) => this.setState({ chain: data, pageNumber: 1 }));
  }

  //Pagination
  paginatedBlockchain = () => {
    const { length } = this.state.chain;
    let startIndex = length - BLOCKS_PER_PAGE * this.state.pageNumber;
    const endIndex =
      startIndex + BLOCKS_PER_PAGE < length
        ? startIndex + BLOCKS_PER_PAGE
        : length;
    startIndex =
      length - BLOCKS_PER_PAGE * this.state.pageNumber >= 0
        ? length - BLOCKS_PER_PAGE * this.state.pageNumber
        : 0;

    const chainSlice = this.state.chain.slice(startIndex, endIndex).reverse();

    return chainSlice;
  };

  showPage = (event) => {
    const { length } = this.state.chain;

    this.setState({
      pageNumber: Math.ceil(
        (length - this.state.inputBlockNo) / BLOCKS_PER_PAGE
      ),
      inputBlockNo: 0,
    });
  };

  updateInputBlockNo = (event) => {
    this.setState({ inputBlockNo: Number(event.target.value) });
  };

  pageUp = () => {
    const newPageNumber = this.state.pageNumber + 1;
    this.setState({ pageNumber: newPageNumber });
  };

  pageDown = () => {
    const newPageNumber = this.state.pageNumber - 1;
    this.setState({ pageNumber: newPageNumber });
  };
  //Pagination end

  render() {
    let maxPageNumber = Math.ceil(this.state.chain.length / BLOCKS_PER_PAGE);
    let chainSlice = this.paginatedBlockchain();

    return (
      <div>
        <Navigation activeComponent='blocks' />

        <div className='container'>
          <h2>Blockchain</h2>
          <div className='blocks-search'>
            <div style={{ margin: '10px', padding: '20px' }}>
              <Button variant='dark' onClick={this.pageDown}>
                {'<'}
              </Button>{' '}
              <Button variant='dark'>{this.state.pageNumber}</Button>{' '}
              <Button variant='dark' onClick={this.pageUp}>
                {'>'}
              </Button>
            </div>
            <div style={{ margin: '10px', padding: '20px' }}>
              <FormGroup className='blocks-search'>
                <FormLabel>Block no:</FormLabel>
                <FormControl
                  style={{ width: '60px' }}
                  type='number'
                  value={this.state.inputBlockNo}
                  onChange={this.updateInputBlockNo}
                />
                <Button variant='dark' size='sm' onClick={this.showPage}>
                  Search
                </Button>
              </FormGroup>
            </div>
          </div>

          {chainSlice.map((block) => {
            return <Block key={block.index} block={block} />;
          })}
        </div>
      </div>
    );
  }
}

export default Blocks;
