import React, { Component } from 'react';
import logo from './logo.svg';
import del from './img/delete.png';
import './App.css';
import { Button, Table, Card, CardBody, Form, Row, Col, FormGroup, Label, Input } from 'reactstrap';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      restaurants: [],
      page: 0,
      count: 0,
    };
  }

  render() {
    return (
      <div>
        <header>
        <Card color="primary" styles={{padding :'30px'}} >
        <CardBody>
        <Form>
        <Row form>
        <FormGroup>
              <Label for="name">Rechercher : </Label>
              <Input type="text" name="search" id="search" value={this.state.search} placeholder="Nom du restaurant" onChange={this.handleChange}/>
            </FormGroup>
          <Button color="success" styles={{float :'right!important'}} onClick={(e) => this.callApi()}>Rechercher</Button>

        </Row>
        </Form>
        </CardBody>
        </Card>
        <Card color="primary">
          <CardBody>
        <Form>
        <Row form>
          <Col md={6}>
            <FormGroup>
              <Label for="name">Nom : </Label>
              <Input type="text" name="name" id="name" value={this.state.name} placeholder="Nom du restaurant" onChange={this.handleChange}/>
            </FormGroup>
          </Col>
          <Col md={6}>
            <FormGroup>
              <Label for="cuisine">Cuisine : </Label>
              <Input type="text" name="cuisine" id="cuisine" value={this.state.cuisine} placeholder="Type de cuisine" onChange={this.handleChange}/>
            </FormGroup>
          </Col>
          <Button color="success" styles={{float :'right!important'}} onClick={(e) => this.addRestaurant()}>Ajouter</Button>
        </Row>
        </Form>
      </CardBody>
      </Card>
      

          <Table striped bordered condensed hover>
  <thead>
    <tr>
      <th>#</th>
      <th>Nom</th>
      <th>Cuisine</th>
      <th>Adresse</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    
    {this.state.restaurants.map((restaurant, index) => {
                    return                     <tr>
                    <th scope="row">{ index * (this.state.page + 1) }</th>
                    <td>{restaurant.name}</td>
                    <td>{restaurant.cuisine}</td>
                    <td>{restaurant.address.street}</td>
                    <td><img src={del} onClick={(e) => this.deleteRestaurant(restaurant._id)}></img></td>
                    </tr>;
                  })
                }
    
  </tbody>
</Table>

     <ul className="pagination">
     <li className="page-item"><a className="page-link" onClick={(e) => this.setPage(0)}>First</a></li>
     <li className="page-item"><a className="page-link" onClick={(e) => this.setPage(this.state.page - 1)}>Previous</a></li>
          {this.createPaggination()}
          <li className="page-item"><a className="page-link" onClick={(e) => this.setPage(this.state.page + 1)}>Next</a></li>
          <li className="page-item"><a className="page-link" onClick={(e) => this.setPage(this.state.count)}>Last</a></li>
      </ul>
        </header>

        <div className="snackbar" id="snackbarDel">Restaurant supprimé</div>
        <div className="snackbar" id="snackbarAdd">Restaurant Ajouté</div>
        <div className="snackbar" id="snackbarDelErr">Erreur suppression restaurant</div>
        <div className="snackbar" id="snackbarAddErr">Erreur ajout restaurant</div>
      </div>

      
    );
  }

  componentDidMount(){
    this.callApi();
  }


  showMessage(id) {
    // Get the snackbar DIV
    var x = document.getElementById(id);

    // Add the "show" class to DIV
    x.className = "show";

    // After 3 seconds, remove the show class from DIV
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

  deleteRestaurant(index){
    var url = "http://localhost:8080/api/restaurants/" + index;
    fetch(url, {
      method: 'delete'
    })
		.then((responseJSON) => {
        	responseJSON.json()
        	.then((res) => {
            console.log(res);
            this.showMessage("snackbarDel");
            this.callApi();
        	});
    	})
    	.catch((err) => {
          console.log(err);
          this.showMessage("snackbarDelErr");
    });
  }

  addRestaurant(){
    var name = document.getElementById('name').value;
    var cuisine = document.getElementById('cuisine').value;

    var formData = new FormData();
    formData.append("nom", name);
    formData.append("cuisine", cuisine);

    var url = "http://localhost:8080/api/restaurants";
    fetch(url, {
      method: 'post',
      body: formData
    })
		.then((responseJSON) => {
        	responseJSON.json()
        	.then((res) => {
            console.log(res);
            this.showMessage("snackbarAdd");
            this.callApi();
        	});
    	})
    	.catch((err) => {
          console.log(err);
          this.showMessage("snackbarAddErr");
    });
  }


  createPaggination = () => {
    let paggination = []

    if(this.state.page < 5){

    for (let i = 0; i < this.state.count; i++) {
      if(i < 10){
        if(i == this.state.page){
          paggination.push(<li className="page-item active"><a className="page-link"  onClick={(e) => this.setPage(i)}>{
            i+1
          }</a></li>)
        }
        else{
          paggination.push(<li className="page-item"><a className="page-link"  onClick={(e) => this.setPage(i)}>{
            i+1
          }</a></li>)
        }
      
    }
  }
}

else{
  for (let i = this.state.page - 5; i < this.state.count; i++) {
    if(i < this.state.page + 5){ 
      if(i == this.state.page){
        paggination.push(<li className="page-item active"><a className="page-link"  onClick={(e) => this.setPage(i)}>{
          i+1
        }</a></li>)
      }

      else{
        paggination.push(<li className="page-item"><a className="page-link"  onClick={(e) => this.setPage(i)}>{
          i+1
        }</a></li>)
      }
    
  }
}
}
    return paggination


  }

  setPage(i){
    if(i >= 0){
      this.setState({page: i});
      this.callApi();
    }
  }

  callApi(){
    var search = document.getElementById("search").value;
    if(search == "" || search == null){
    var url = "http://localhost:8080/api/restaurants?page="+ this.state.page +"&pagesize=10";
    }
    else{
      var url = "http://localhost:8080/api/restaurants?page="+ this.state.page +"&pagesize=10&name="+ search;
    }
    console.log(url);
    fetch(url)
		.then((responseJSON) => {
        	responseJSON.json()
        	.then((res) => {
            console.log(res);
            this.setState({count: Math.ceil(res.count/30)});
            this.setState({restaurants: res.data});
        	});
    	})
    	.catch(function (err) {
        	console.log(err);
    });
}

}

export default App;
