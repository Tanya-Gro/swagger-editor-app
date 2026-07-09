import GitHubIcon from '@mui/icons-material/GitHub';
import { Avatar, Card, CardContent, Link, Typography } from '@mui/material';
import classNames from 'classnames/bind';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import styles from './About.module.css';

const cx = classNames.bind(styles);

const teamPhotoUrl = '/assets/about-team.jpg';
const schoolLogoUrl = '/assets/rs-school-logo.svg';
const schoolCourseUrl = 'https://rs.school/courses/reactjs';

const techStack = ['Next.js', 'React', 'TypeScript', 'Material UI', 'next-intl', 'Vitest', 'Supabase'] as const;

const teamRoles = [
  {
    nameKey: 'alexey',
    github: '@ansivgit',
    href: 'https://github.com/ansivgit',
    photo: '/assets/about-sloths/sloth-1.webp',
  },
  {
    nameKey: 'daria',
    github: '@Tanya-Gro',
    href: 'https://github.com/Tanya-Gro',
    photo: '/assets/about-sloths/sloth-2.webp',
  },
  {
    nameKey: 'bogdan',
    github: '@mariarp10',
    href: 'https://github.com/mariarp10',
    photo: '/assets/about-sloths/sloth-3.webp',
  },
  {
    nameKey: 'viktor',
    github: '@andreiTsen',
    href: 'https://github.com/andreiTsen',
    photo: '/assets/about-sloths/sloth-4.webp',
  },
] as const;

function AboutPhotoCard() {
  const t = useTranslations('ABOUT_PAGE');

  return (
    <Card className={cx('photo-card')} elevation={0}>
      <div className={cx('photo-card-image-frame')}>
        <Image
          src={teamPhotoUrl}
          alt={t('photoAlt')}
          className={cx('photo-card-image')}
          fill
          priority
          sizes="(max-width: 1024px) calc(100vw - 48px), 596px"
        />
      </div>
      <CardContent className={cx('photo-card-caption')}>
        <Typography component="h2" className={cx('caption-title')}>
          {t('captionTitle')}
        </Typography>
        <Typography className={cx('caption-text')}>{t('captionText')}</Typography>
      </CardContent>
      <Link
        href={schoolCourseUrl}
        aria-label={t('schoolAriaLabel')}
        className={cx('school-link')}
        rel="noopener noreferrer"
        target="_blank"
        underline="none"
      >
        <Image src={schoolLogoUrl} alt={t('schoolLogoAlt')} className={cx('school-logo')} width={52} height={52} />
        <span className={cx('school-info')}>
          <span className={cx('school-name')}>{t('schoolCourseTitle')}</span>
          <span className={cx('school-description')}>{t('schoolCourseText')}</span>
        </span>
      </Link>
    </Card>
  );
}

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
          <AboutPhotoCard />

          <div className={cx('role-grid')} aria-label={t('rolesAriaLabel')}>
            {teamRoles.map(({ github, href, nameKey, photo }) => (
              <Card component="article" className={cx('role-card')} elevation={0} key={github}>
                <Avatar className={cx('role-photo')} variant="rounded">
                  <Image
                    src={photo}
                    alt={t(`roles.${nameKey}.alt`)}
                    className={cx('role-photo-image')}
                    width={72}
                    height={72}
                  />
                </Avatar>
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

        <section className={cx('app-info')} aria-labelledby="about-app-title">
          <div className={cx('app-info-copy')}>
            <Typography component="h2" className={cx('app-info-title')} id="about-app-title">
              {t('appInfoTitle')}
            </Typography>
            <Typography className={cx('app-info-text')}>{t('appInfoText')}</Typography>
          </div>
          <div className={cx('stack-list')} aria-label={t('techStackAriaLabel')}>
            {techStack.map((technology) => (
              <span className={cx('stack-item')} key={technology}>
                {technology}
              </span>
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
