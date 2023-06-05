import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

export const MetaHelmet = ({ title }) => (
  <Helmet>
    <title> {title} | IMA </title>
  </Helmet>
);

MetaHelmet.propTypes = {
  title: PropTypes.string,
};
