import GitHubIcon from '@mui/icons-material/GitHub';
import { Avatar, Box, Card, CardContent, Link, Typography } from '@mui/material';
import classNames from 'classnames/bind';
import { useTranslations } from 'next-intl';
import styles from './About.module.css';

const cx = classNames.bind(styles);

const teamPhotoUrl = '/assets/about-team.jpg';

const teamRoles = [
  {
    nameKey: 'alexey',
    github: '@alex-morozov',
    href: 'https://github.com/alex-morozov',
    photo: 'https://i.pravatar.cc/160?img=12',
  },
  {
    nameKey: 'daria',
    github: '@daria-ui',
    href: 'https://github.com/daria-ui',
    photo: 'https://i.pravatar.cc/160?img=32',
  },
  {
    nameKey: 'bogdan',
    github: '@bogdan-api',
    href: 'https://github.com/bogdan-api',
    photo: 'https://i.pravatar.cc/160?img=59',
  },
  {
    nameKey: 'viktor',
    github: '@viktor-review',
    href: 'https://github.com/viktor-review',
    photo: 'https://i.pravatar.cc/160?img=68',
  },
] as const;

export function About() {
  const t = useTranslations('ABOUT_PAGE');

  return (
    <section className={cx('about-team')}>
      <div className={cx('inner')}>
        <header className={cx('header')}>
          <Typography component="h1" className={cx('title')}>
            {t('title')}
          </Typography>
          <Typography className={cx('subtitle')}>{t('subtitle')}</Typography>
        </header>

        <div className={cx('content')}>
          <Card className={cx('photo-card')} elevation={0}>
            <Box component="img" src={teamPhotoUrl} alt={t('photoAlt')} className={cx('photo-card-image')} />
            <CardContent className={cx('photo-card-caption')}>
              <Typography component="h2" className={cx('caption-title')}>
                {t('captionTitle')}
              </Typography>
              <Typography className={cx('caption-text')}>{t('captionText')}</Typography>
            </CardContent>
          </Card>

          <div className={cx('role-grid')} aria-label={t('rolesAriaLabel')}>
            {teamRoles.map(({ github, href, nameKey, photo }) => (
              <Card component="article" className={cx('role-card')} elevation={0} key={github}>
                <Avatar alt={t(`roles.${nameKey}.alt`)} src={photo} className={cx('role-photo')} variant="rounded" />
                <Typography component="h3" className={cx('role-name')}>
                  {t(`roles.${nameKey}.name`)}
                </Typography>
                <Link
                  href={href}
                  className={cx('github-link')}
                  rel="noopener noreferrer"
                  target="_blank"
                  underline="none"
                >
                  <GitHubIcon aria-hidden="true" className={cx('github-icon')} fontSize="inherit" />
                  {github}
                </Link>
                <Typography className={cx('role-description')}>{t(`roles.${nameKey}.description`)}</Typography>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
