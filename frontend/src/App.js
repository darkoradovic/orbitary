import React from "react";
import { Container } from "react-bootstrap";
import { Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomeScreen from "./screens/HomeScreen";
import ProductScreen from "./screens/ProductScreen";
import CartScreen from "./screens/CartScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ProfileScreen from "./screens/ProfileScreen";
import ShippingScreen from "./screens/ShippingScreen";
import PaymentScreen from "./screens/PaymentScreen";
import PlaceOrderScreen from "./screens/PlaceOrderScreen";
import OrderScreen from "./screens/OrderScreen";
import UserListScreen from "./screens/UserListScreen";
import userEditScreen from "./screens/UserEditScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductEditScreen from "./screens/ProductEditScreen";
import OrderListScreen from "./screens/OrderListScreen";
import ChatScreen from "./screens/ChatScreen";
import ServicesScreen from "./screens/ServicesScreen";
import ContactUsScreen from "./screens/ContactUsScreen";
import ForgotPasswordScreen from "./screens/ForgotPasswordScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";


const App = () => {
  return (
    <>
      <Header />
      <main>
        <Container>
          <Route exact path="/login" component={LoginScreen} />
          <Route exact path='/register' component={RegisterScreen} />
          <Route exact path='/reset' component={ForgotPasswordScreen} />
          <Route exact path='/reset/:token' component={ResetPasswordScreen} />
          <Route exact path='/profile' component={ProfileScreen} />
          <Route exact path='/shipping' component={ShippingScreen} />
          <Route exact path='/payment' component={PaymentScreen} />
          <Route exact path='/placeorder' component={PlaceOrderScreen} />
          <Route exact path='/chat' component={ChatScreen} />
          <Route exact path='/services' component={ServicesScreen} />
          <Route exact path="/services/page/:pageNumber" component={ServicesScreen} />
          <Route exact path="/services/search/:keyword" component={ServicesScreen} />
          <Route exact path="/contact" component={ContactUsScreen} />
          <Route exact path='/order/:id' component={OrderScreen} />
          <Route exact path='/admin/orderlist' component={OrderListScreen} />
          <Route exact path='/admin/userlist' component={UserListScreen} />
          <Route exact path='/admin/user/:id/edit' component={userEditScreen} />
          <Route exact path='/admin/productlist' component={ProductListScreen} />
          <Route exact path='/admin/productlist/:pageNumber' component={ProductListScreen} />
          <Route exact path="/product/:id" component={ProductScreen} />
          <Route exact path="/admin/product/:id/edit" component={ProductEditScreen} />
          <Route exact path="/cart/:id?" component={CartScreen} /> {/* ? na kraju id je da je id optional jer ne mora da ima id da bi otisli na cart */}  
        </Container>
          
          <Route exact path="/services/search/:keyword/page/:pageNumber" component={ServicesScreen} />
          <Route exact path="/" component={HomeScreen} />
      </main>
     {/*  <Footer /> */}
    </>
  );
}

export default App;
