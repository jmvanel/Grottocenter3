import React from 'react';
import PropTypes from 'prop-types';
import InputBase from '@material-ui/core/InputBase';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { withStyles } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';

const styles = theme => ({
  root: {
    width: '100%',
    marginRight:'40px'
  },
  grow: {
    flexGrow: 1,
  },
  search: {
    position: 'relative',
    marginRight:'20px',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.45),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.45),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit,
      width: 'auto',
      marginRight: theme.spacing.unit,
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color:'#fff',
  },
  inputRoot: {
    color: '#333',
    width: '100%',
    height: '35px',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('xs')]: {
      width: 0,
      '&:focus': {
        width: 150,
      },
    },
    [theme.breakpoints.up('sm')]: {
      width: 0,
      '&:focus': {
        width: 200,
      },
    },
  },
});

function QuickSearch(props) {
  const { classes } = props;
  return (
    <div>
    <div className={classes.grow} />
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <SearchIcon />
      </div>
      <InputBase
        placeholder="Recherche Rapide"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
      />
      </div>
    </div>
  );
}

QuickSearch.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(QuickSearch);