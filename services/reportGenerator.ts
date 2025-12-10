import { Observation, Participant, Supplier } from '../types';

export const generateEmailHtml = (
    observations: Observation[],
    participants: Participant[],
    selectedSupplier: Supplier | null,
    date: string,
    executiveSummary: string
) => {
    // Professional Corporate HTML Template
    const primaryColor = "#0f172a"; // Slate-900 for a more modern sharp look
    const accentColor = "#2563eb"; // Blue-600
    const lightBg = "#f1f5f9";
    const cardBg = "#ffffff";
    const borderColor = "#e2e8f0";
    const textPrimary = "#1e293b";
    const textSecondary = "#64748b";

    const rows = observations.map((obs, idx) => `
    <tr style="background-color: ${idx % 2 === 0 ? '#ffffff' : '#f8fafc'}; border-bottom: 1px solid ${borderColor};">
      <td style="padding: 16px 12px; vertical-align: top; color: ${textPrimary}; font-weight: 600; font-size: 13px; width: 15%;">${obs.category}</td>
      <td style="padding: 16px 12px; vertical-align: top; color: ${textPrimary}; font-size: 14px; line-height: 1.6;">
        ${obs.polishedDescription || obs.description}
        ${obs.photoDataUrl ? `<br/><div style="margin-top:8px; padding: 4px 8px; background-color: #eff6ff; border-radius: 4px; display: inline-block; font-size:11px; color: ${accentColor}; font-weight: 500;">📸 Photo Evidence Attached in App</div>` : ''}
      </td>
      <td style="padding: 16px 12px; vertical-align: top; color: ${textSecondary}; font-size: 13px; width: 12%;">${obs.responsibility || '-'}</td>
      <td style="padding: 16px 12px; vertical-align: top; color: ${textSecondary}; font-size: 13px; width: 12%; white-space: nowrap;">${obs.targetDate || 'Immediate'}</td>
      <td style="padding: 16px 12px; vertical-align: top; text-align:center; width: 10%;">
        <span style="display:inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; background-color: ${obs.status === 'OPEN' ? '#fef2f2' : '#f0fdf4'}; color: ${obs.status === 'OPEN' ? '#ef4444' : '#16a34a'}; border: 1px solid ${obs.status === 'OPEN' ? '#fecaca' : '#bbf7d0'};">
          ${obs.status}
        </span>
      </td>
    </tr>
  `).join('');

    const customerTeam = participants.filter(p => p.type === 'CUSTOMER');
    const supplierTeam = participants.filter(p => p.type === 'SUPPLIER');

    const renderTeamList = (team: Participant[]) => {
        if (team.length === 0) return '<div style="font-style: italic; color: #94a3b8; font-size: 13px;">No participants listed</div>';
        return `<ul style="list-style: none; padding: 0; margin: 0;">
          ${team.map(p => `
              <li style="margin-bottom: 8px; font-size: 14px; color: ${textPrimary};">
                  <strong style="display: block; color: ${textPrimary};">${p.name}</strong>
                  <span style="display: block; font-size: 12px; color: ${textSecondary}; margin-top: 2px;">${p.designation}</span>
              </li>
          `).join('')}
      </ul>`;
    }

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.5; margin: 0; padding: 0; -webkit-font-smoothing: antialiased; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; background-color: ${lightBg}; color: ${textPrimary};">
      <div style="max-width: 800px; margin: 0 auto; background-color: ${cardBg}; font-family: sans-serif;">
        
        <!-- Top Bar -->
        <div style="height: 6px; background: linear-gradient(90deg, ${primaryColor} 0%, ${accentColor} 100%);"></div>

        <!-- Header -->
        <div style="padding: 40px 40px 30px 40px; background-color: white;">
          <table style="width: 100%; border-collapse: collapse;">
              <tr>
                  <td style="vertical-align: top;">
                      <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: ${primaryColor}; letter-spacing: -0.025em; line-height: 1.2;">Minutes of Meeting</h1>
                      <p style="margin: 8px 0 0 0; font-size: 15px; color: ${textSecondary}; font-weight: 500;">Supplier Visit Report</p>
                  </td>
                  <td style="vertical-align: top; text-align: right;">
                      <div style="display: inline-block; padding: 8px 16px; background-color: ${lightBg}; border-radius: 6px; text-align: left;">
                          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: ${textSecondary}; font-weight: 700; margin-bottom: 2px;">Date</div>
                          <div style="font-size: 16px; font-weight: 600; color: ${textPrimary};">${date}</div>
                      </div>
                  </td>
              </tr>
          </table>
        </div>

        <!-- Supplier Details Card -->
        <div style="padding: 0 40px 30px 40px;">
          <div style="background-color: #f8fafc; border: 1px solid ${borderColor}; border-radius: 8px; padding: 20px;">
              <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                      <td style="vertical-align: top;">
                          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: ${textSecondary}; font-weight: 700; margin-bottom: 4px;">Supplier Name</div>
                          <div style="font-size: 18px; font-weight: 700; color: ${primaryColor};">${selectedSupplier?.name}</div>
                      </td>
                      <td style="vertical-align: top;">
                          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: ${textSecondary}; font-weight: 700; margin-bottom: 4px;">Supplier Code</div>
                          <div style="font-size: 15px; font-weight: 500; color: ${textPrimary};">${selectedSupplier?.code}</div>
                      </td>
                      <td style="vertical-align: top;">
                          <div style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; color: ${textSecondary}; font-weight: 700; margin-bottom: 4px;">Location</div>
                          <div style="font-size: 15px; font-weight: 500; color: ${textPrimary};">${selectedSupplier?.location}</div>
                      </td>
                  </tr>
              </table>
          </div>
        </div>

        <div style="padding: 0 40px 40px 40px;">
          
          <!-- Executive Summary -->
          ${executiveSummary ? `
          <div style="margin-bottom: 40px;">
            <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: ${primaryColor}; font-weight: 800; border-bottom: 2px solid ${borderColor}; padding-bottom: 10px; margin-top: 0; margin-bottom: 16px;">Executive Summary</h3>
            <div style="background-color: #ffffff; border-left: 4px solid ${accentColor}; padding: 4px 0 4px 16px; font-size: 15px; line-height: 1.7; color: ${textPrimary};">
              ${executiveSummary.replace(/\n/g, '<br/>')}
            </div>
          </div>
          ` : ''}

          <!-- Participants Grid -->
          <div style="margin-bottom: 40px;">
            <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: ${primaryColor}; font-weight: 800; border-bottom: 2px solid ${borderColor}; padding-bottom: 10px; margin-top: 0; margin-bottom: 16px;">Attendees</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                  <td style="width: 50%; vertical-align: top; padding-right: 20px;">
                      <div style="background-color: #f1f5f9; padding: 12px 16px; border-radius: 6px 6px 0 0; border-bottom: 1px solid ${borderColor}; font-size: 12px; font-weight: 700; color: ${primaryColor}; text-transform: uppercase;">Customer Team</div>
                      <div style="border: 1px solid ${borderColor}; border-top: none; border-radius: 0 0 6px 6px; padding: 16px;">
                          ${renderTeamList(customerTeam)}
                      </div>
                  </td>
                  <td style="width: 50%; vertical-align: top; padding-left: 20px;">
                      <div style="background-color: #f0fdf4; padding: 12px 16px; border-radius: 6px 6px 0 0; border-bottom: 1px solid ${borderColor}; font-size: 12px; font-weight: 700; color: #15803d; text-transform: uppercase;">Supplier Team</div>
                      <div style="border: 1px solid ${borderColor}; border-top: none; border-radius: 0 0 6px 6px; padding: 16px;">
                          ${renderTeamList(supplierTeam)}
                      </div>
                  </td>
              </tr>
            </table>
          </div>

          <!-- Observations Table -->
          <div>
            <h3 style="font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: ${primaryColor}; font-weight: 800; border-bottom: 2px solid ${borderColor}; padding-bottom: 10px; margin-top: 0; margin-bottom: 16px;">Observations & Action Plan</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 0; font-size: 14px;">
              <thead>
                <tr style="background-color: ${lightBg};">
                  <th style="text-align: left; padding: 12px; font-size: 11px; font-weight: 700; color: ${textSecondary}; text-transform: uppercase; letter-spacing: 0.05em; border-top: 1px solid ${borderColor}; border-bottom: 1px solid ${borderColor};">Category</th>
                  <th style="text-align: left; padding: 12px; font-size: 11px; font-weight: 700; color: ${textSecondary}; text-transform: uppercase; letter-spacing: 0.05em; border-top: 1px solid ${borderColor}; border-bottom: 1px solid ${borderColor}; width: 40%;">Description</th>
                  <th style="text-align: left; padding: 12px; font-size: 11px; font-weight: 700; color: ${textSecondary}; text-transform: uppercase; letter-spacing: 0.05em; border-top: 1px solid ${borderColor}; border-bottom: 1px solid ${borderColor};">Resp.</th>
                  <th style="text-align: left; padding: 12px; font-size: 11px; font-weight: 700; color: ${textSecondary}; text-transform: uppercase; letter-spacing: 0.05em; border-top: 1px solid ${borderColor}; border-bottom: 1px solid ${borderColor};">Target</th>
                  <th style="text-align: center; padding: 12px; font-size: 11px; font-weight: 700; color: ${textSecondary}; text-transform: uppercase; letter-spacing: 0.05em; border-top: 1px solid ${borderColor}; border-bottom: 1px solid ${borderColor};">Status</th>
                </tr>
              </thead>
              <tbody>
                ${rows}
              </tbody>
            </table>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: ${lightBg}; padding: 24px 40px; text-align: center; border-top: 1px solid ${borderColor}; color: ${textSecondary}; font-size: 12px;">
          <p style="margin: 0 0 8px 0;">Generated by <strong>AutoMoM</strong> • Professional Supplier Visit Recorder</p>
          <p style="margin: 0; opacity: 0.7;">Confidential • For Internal Use Only</p>
        </div>
      </div>
    </body>
    </html>
  `;
};
