import PageLayout from './PageLayout'
import type { ProfileData } from './ProfileModal'
import './ProfilePage.css'

interface ProfilePageProps {
  profile: ProfileData
  onBack: () => void
}

function ProfilePage({ profile, onBack }: ProfilePageProps) {
  return (
    <PageLayout fullWidth>
      <div className="profile-page">
        <header className="profile-page-header">
          <button className="back-btn" onClick={onBack}>← Back</button>
          <div className="profile-identity">
            <img src={profile.avatar} alt={profile.name} className="pp-avatar" />
            <div>
              <h1 className="pp-name">{profile.name}</h1>
              <div className="pp-sub">{profile.principal}</div>
            </div>
          </div>
        </header>

        <main className="profile-page-main">
          <section className="pp-left">
            {profile.bio && <p className="pp-bio">{profile.bio}</p>}

            <div className="pp-stats">
              <div className="pp-stat"><span className="num">{profile.repositories ?? 0}</span><span className="lbl">Repositories</span></div>
              <div className="pp-stat"><span className="num">{profile.followers ?? 0}</span><span className="lbl">Followers</span></div>
              <div className="pp-stat"><span className="num">{profile.following ?? 0}</span><span className="lbl">Following</span></div>
            </div>

            <div className="pp-links">
              {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer">🌐 Website</a>}
              {profile.twitter && <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer">🐦 Twitter</a>}
              {profile.github && <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer">📚 GitHub</a>}
            </div>

            <div className="pp-meta">
              {profile.location && <div>📍 {profile.location}</div>}
              {profile.joinedDate && <div>Joined: {new Date(profile.joinedDate).toLocaleDateString()}</div>}
              {typeof profile.contributions === 'number' && <div>Contributions: {profile.contributions}</div>}
            </div>
          </section>

          <section className="pp-right">
            <h3>Recent Activity</h3>
            <div className="pp-activity">
              <div className="item"><span>📝</span><div>Updated a repository README.md</div><time>2h</time></div>
              <div className="item"><span>✨</span><div>Opened a pull request</div><time>1d</time></div>
              <div className="item"><span>🔧</span><div>Fixed CI workflow</div><time>3d</time></div>
            </div>
          </section>
        </main>
      </div>
    </PageLayout>
  )
}

export default ProfilePage

