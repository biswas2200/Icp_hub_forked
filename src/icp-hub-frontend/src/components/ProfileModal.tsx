import './ProfileModal.css'

export interface ProfileData {
  principal: string
  name: string
  avatar: string
  bio?: string
  location?: string
  website?: string
  twitter?: string
  github?: string
  joinedDate?: string
  repositories?: number
  followers?: number
  following?: number
  contributions?: number
}

interface ProfileModalProps {
  isOpen: boolean
  onClose: () => void
  profile: ProfileData | null
}

function ProfileModal({ isOpen, onClose, profile }: ProfileModalProps) {
  if (!isOpen || !profile) return null

  return (
    <div className="profile-modal-backdrop" role="dialog" aria-modal="true">
      <div className="profile-modal">
        <div className="profile-modal-header">
          <div className="profile-modal-title">
            <img src={profile.avatar} alt={profile.name} className="profile-modal-avatar" />
            <div>
              <h3>{profile.name}</h3>
              <div className="profile-modal-sub">{profile.principal}</div>
            </div>
          </div>
          <button className="profile-modal-close" onClick={onClose} aria-label="Close profile">✕</button>
        </div>

        {profile.bio && <p className="profile-modal-bio">{profile.bio}</p>}

        <div className="profile-modal-stats">
          <div className="pm-stat"><span className="num">{profile.repositories ?? 0}</span><span className="lbl">Repos</span></div>
          <div className="pm-stat"><span className="num">{profile.followers ?? 0}</span><span className="lbl">Followers</span></div>
          <div className="pm-stat"><span className="num">{profile.following ?? 0}</span><span className="lbl">Following</span></div>
        </div>

        <div className="profile-modal-links">
          {profile.website && <a href={profile.website} target="_blank" rel="noopener noreferrer">🌐 Website</a>}
          {profile.twitter && <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noopener noreferrer">🐦 Twitter</a>}
          {profile.github && <a href={`https://github.com/${profile.github}`} target="_blank" rel="noopener noreferrer">📚 GitHub</a>}
        </div>

        <div className="profile-modal-meta">
          {profile.location && <div>📍 {profile.location}</div>}
          {profile.joinedDate && <div>Joined: {new Date(profile.joinedDate).toLocaleDateString()}</div>}
          {typeof profile.contributions === 'number' && <div>Contributions: {profile.contributions}</div>}
        </div>
      </div>
    </div>
  )
}

export default ProfileModal

