import GitHubIcon from '@mui/icons-material/GitHub';
import { Avatar, Box, Card, CardContent, Link, Typography } from '@mui/material';
import classNames from 'classnames/bind';
import styles from './About.module.css';

const cx = classNames.bind(styles);

const teamPhotoUrl = '/assets/about-team.jpg';

const teamRoles = [
  {
    name: 'Алексей Морозов',
    github: '@alex-morozov',
    href: 'https://github.com/alex-morozov',
    photo: 'https://i.pravatar.cc/160?img=12',
    alt: 'Портрет Алексея Морозова',
    description: 'Frontend: собирает интерфейс, адаптив и API-интеракции.',
  },
  {
    name: 'Дарья Соколова',
    github: '@daria-ui',
    href: 'https://github.com/daria-ui',
    photo: 'https://i.pravatar.cc/160?img=32',
    alt: 'Портрет Дарьи Соколовой',
    description: 'UI: отвечает за визуальный ритм, карточки, отступы и состояния.',
  },
  {
    name: 'Богдан Иванов',
    github: '@bogdan-api',
    href: 'https://github.com/bogdan-api',
    photo: 'https://i.pravatar.cc/160?img=59',
    alt: 'Портрет Богдана Иванова',
    description: 'Docs: пишет API-тексты, примеры эндпоинтов и описание flow.',
  },
  {
    name: 'Виктор Лебедев',
    github: '@viktor-review',
    href: 'https://github.com/viktor-review',
    photo: 'https://i.pravatar.cc/160?img=68',
    alt: 'Портрет Виктора Лебедева',
    description: 'Mentor: проверяет UX, архитектуру и качество результата.',
  },
] as const;

export function About() {
  return (
    <section className={cx('about-team')}>
      <div className={cx('inner')}>
        <header className={cx('header')}>
          <Typography component="h1" className={cx('title')}>
            Наша команда
          </Typography>
          <Typography className={cx('subtitle')}>Четыре роли, которые держат проект в равновесии.</Typography>
        </header>

        <div className={cx('content')}>
          <Card className={cx('photo-card')} elevation={0}>
            <Box
              component="img"
              src={teamPhotoUrl}
              alt="Команда рабочих сидит на балке над городом"
              className={cx('photo-card-image')}
            />
            <CardContent className={cx('photo-card-caption')}>
              <Typography component="h2" className={cx('caption-title')}>
                Одна балка, четыре роли.
              </Typography>
              <Typography className={cx('caption-text')}>
                Фотография задает метафору страницы: команда держит баланс между кодом, дизайном, документацией и ревью.
              </Typography>
            </CardContent>
          </Card>

          <div className={cx('role-grid')} aria-label="Роли команды">
            {teamRoles.map(({ alt, description, github, href, name, photo }) => (
              <Card component="article" className={cx('role-card')} elevation={0} key={github}>
                <Avatar alt={alt} src={photo} className={cx('role-photo')} variant="rounded" />
                <Typography component="h3" className={cx('role-name')}>
                  {name}
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
                <Typography className={cx('role-description')}>{description}</Typography>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
