import React from 'react';
import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import { Toolbar, Tooltip, IconButton, Typography, OutlinedInput, InputAdornment, Tabs, Tab } from '@mui/material';

import { colors } from '../../../theme/colors';
// component
import Iconify from '../../../components/iconify';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
}));

// ----------------------------------------------------------------------

ListToolbar.propTypes = {
  numSelected: PropTypes.number,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  setType: PropTypes.func,
  handleDelete: PropTypes.func,
  type: PropTypes.any,
  tabs: PropTypes.any,
};

export default function ListToolbar({ numSelected, filterName, onFilterName, setType, type, handleDelete, tabs }) {
  const handleChange = (event, newValue) => {
    setType({
      tab: newValue,
      label: event?.target?.innerText?.toLowerCase(),
    });
  };

  return (
    <StyledRoot
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      <Tabs
        textColor="inherit"
        indicatorColor="inherit"
        value={type?.tab}
        onChange={handleChange}
        aria-label="icon position tabs example"
      >
        {tabs?.map((tab, key) => (
          <Tab
            key={key}
            sx={{
              borderBottom: type?.tab === tab.tabId && `1px solid ${colors.green}`,
              color: type?.tab === tab.tabId ? colors.green : colors.primary,
            }}
            icon={tab.icon}
            iconPosition="start"
            label={tab.label}
          />
        ))}
      </Tabs>
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <StyledSearch
          value={filterName}
          onChange={onFilterName}
          placeholder="Search user..."
          startAdornment={
            <InputAdornment position="start">
              <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled', width: 20, height: 20 }} />
            </InputAdornment>
          }
        />
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          {handleDelete && (
            <IconButton onClick={handleDelete}>
              <Iconify icon="eva:trash-2-fill" />
            </IconButton>
          )}
        </Tooltip>
      ) : (
        <Tooltip title="Filter list">
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </StyledRoot>
  );
}
