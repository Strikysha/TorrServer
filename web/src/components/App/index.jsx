import CssBaseline from '@material-ui/core/CssBaseline'
import { useEffect, useState } from 'react'
import Typography from '@material-ui/core/Typography'
import IconButton from '@material-ui/core/IconButton'
import { Menu as MenuIcon, Close as CloseIcon } from '@material-ui/icons'
import { echoHost } from 'utils/Hosts'
import Div100vh from 'react-div-100vh'
import axios from 'axios'
import TorrentList from 'components/TorrentList'
import DonateSnackbar from 'components/Donate'
import DonateDialog from 'components/Donate/DonateDialog'
import useChangeLanguage from 'utils/useChangeLanguage'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import { ThemeProvider as StyledComponentsThemeProvider } from 'styled-components'
import { useQuery } from 'react-query'
import { getTorrents } from 'utils/Utils'
import GlobalStyle from 'style/GlobalStyle'

import { AppWrapper, AppHeader, LanguageSwitch } from './style'
import Sidebar from './Sidebar'
import { darkTheme, lightTheme, useMaterialUITheme } from '../../style/materialUISetup'
import getStyledComponentsTheme from '../../style/getStyledComponentsTheme'

export default function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isDonationDialogOpen, setIsDonationDialogOpen] = useState(false)
  const [torrServerVersion, setTorrServerVersion] = useState('')

  // https://material-ui.com/ru/customization/palette/
  const [isDarkMode, muiTheme] = useMaterialUITheme()
  const [currentLang, changeLang] = useChangeLanguage()
  const [isOffline, setIsOffline] = useState(false)
  const { data: torrents, isLoading } = useQuery('torrents', getTorrents, {
    retry: 1,
    refetchInterval: 1000,
    onError: () => setIsOffline(true),
    onSuccess: () => setIsOffline(false),
  })

  useEffect(() => {
    axios.get(echoHost()).then(({ data }) => setTorrServerVersion(data))
  }, [])

  return (
    <>
      <GlobalStyle />

      <MuiThemeProvider theme={muiTheme}>
        <StyledComponentsThemeProvider theme={getStyledComponentsTheme(isDarkMode ? 'dark' : 'light')}>
          <CssBaseline />

          {/* Div100vh - iOS WebKit fix  */}
          <Div100vh>
            <AppWrapper>
              <AppHeader>
                <IconButton
                  style={{ marginRight: '20px' }}
                  color='inherit'
                  onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                  edge='start'
                >
                  {isDrawerOpen ? <CloseIcon /> : <MenuIcon />}
                </IconButton>

                <Typography variant='h6' noWrap>
                  TorrServer {torrServerVersion}
                </Typography>

                <div style={{ justifySelf: 'end' }}>
                  <LanguageSwitch onClick={() => (currentLang === 'en' ? changeLang('ru') : changeLang('en'))}>
                    {currentLang === 'en' ? 'RU' : 'EN'}
                  </LanguageSwitch>
                </div>
              </AppHeader>

              <MuiThemeProvider theme={darkTheme}>
                <Sidebar
                  isOffline={isOffline}
                  isLoading={isLoading}
                  isDrawerOpen={isDrawerOpen}
                  setIsDonationDialogOpen={setIsDonationDialogOpen}
                />
              </MuiThemeProvider>

              <TorrentList isOffline={isOffline} torrents={torrents} isLoading={isLoading} />

              <MuiThemeProvider theme={lightTheme}>
                {isDonationDialogOpen && <DonateDialog onClose={() => setIsDonationDialogOpen(false)} />}
              </MuiThemeProvider>

              {!JSON.parse(localStorage.getItem('snackbarIsClosed')) && <DonateSnackbar />}
            </AppWrapper>
          </Div100vh>
        </StyledComponentsThemeProvider>
      </MuiThemeProvider>
    </>
  )
}