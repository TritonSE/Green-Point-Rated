import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#E96661',
    width: 136,
    height: 35,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  title: {
    fontSize: 16,
    paddingLeft: '2%',
    paddingTop: '3%',
    fontWeight: '500',
  },
});

export default styles;
