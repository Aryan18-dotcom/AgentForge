import nodemailer from 'nodemailer';

export const sendOtpEmail = async (email: string, otp: string) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    await transporter.sendMail({
        from: '"AgentForge" <auth@agentforge.ai>',
        to: email,
        subject: "Your Security Code",
        html: `
            <div style="font-family: sans-serif; max-width: 400px; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
                <h2 style="color: #111; margin-bottom: 8px;">Verify your identity</h2>
                <p style="color: #666; font-size: 14px;">Use the code below to reset your password. This code expires in 5 minutes.</p>
                <div style="background: #fdf2f8; padding: 16px; text-align: center; border-radius: 8px; margin-top: 20px;">
                    <span style="font-size: 32px; font-weight: bold; color: #db2777; letter-spacing: 4px;">${otp}</span>
                </div>
            </div>`
    });
};

interface EmailContextParams {
    username: string;
    accountEmail: string;
    agentName: string;
    currentTokenBalance: number;
}

/**
 * UTILITY MAIL NODE: Dispatches high-priority system alerts and balance exhaustion notifications
 * straight to your workspace operator with a custom premium Bento-styled UI.
 */
export const sendInformationEmailToSupport = async (
    userEmail: string, 
    subject: string, 
    context: EmailContextParams
): Promise<boolean> => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"AgentForge System Core" <${process.env.EMAIL_USER}>`,
            to: userEmail, 
            cc: process.env.SUPPORT_EMAIL || process.env.EMAIL_USER, 
            subject: `⚠️ [AgentForge Cluster Alert]: ${subject}`,
            html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f19; padding: 40px 20px; min-height: 100%;">
                    <div style="background-color: rgba(17, 24, 39, 0.8); border: 1px solid #1f2937; max-width: 560px; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3);">
                        
                        <div style="background: linear-gradient(to bottom, #7c3aed15, transparent); padding: 32px 32px 20px 32px; border-bottom: 1px solid #2d3748;">
                            <div style="display: inline-block; background-color: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); padding: 4px 10px; border-radius: 9999px; font-size: 10px; font-family: monospace; font-weight: bold; tracking-wider: uppercase; letter-spacing: 0.05em; margin-bottom: 16px;">
                                🛑 METRIC EXHAUSTION DETECTED
                            </div>
                            <h2 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; tracking-tight: -0.025em;">Operational Balance Exhausted</h2>
                            <p style="color: #94a3b8; font-size: 13px; margin: 6px 0 0 0;">Automated cluster infrastructure shutdown warning</p>
                        </div>

                        <div style="padding: 32px; color: #dfe2f1;">
                            <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; margin-top: 0;">
                                Hello <strong>${context.username}</strong>, your workspace cluster environments have triggered an automated safety freeze. A public chat node has depleted its operational messaging pools.
                            </p>

                            <div style="background-color: #060811; border: 1px solid #1f2937; border-radius: 12px; padding: 20px; margin: 24px 0; font-family: monospace;">
                                <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: bold; border-bottom: 1px solid #1f2937; padding-bottom: 8px; margin-bottom: 12px; letter-spacing: 0.05em;">
                                    Telemetry Matrix Specs
                                </div>
                                <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                                    <tr>
                                        <td style="color: #64748b; padding: 4px 0; width: 40%;">Target Operator:</td>
                                        <td style="color: #ffffff; font-weight: bold; padding: 4px 0;">${context.username}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #64748b; padding: 4px 0;">Account Email:</td>
                                        <td style="color: #4cd7f6; padding: 4px 0;">${context.accountEmail}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #64748b; padding: 4px 0;">Exhausted Bot:</td>
                                        <td style="color: #7c3aed; font-weight: bold; padding: 4px 0;">🤖 ${context.agentName}</td>
                                    </tr>
                                    <tr>
                                        <td style="color: #64748b; padding: 4px 0;">Remaining Tokens:</td>
                                        <td style="color: #f87171; font-weight: bold; padding: 4px 0; background-color: rgba(239, 68, 68, 0.1); display: inline-block; padding: 2px 6px; border-radius: 4px;">
                                            ${context.currentTokenBalance.toLocaleString()}
                                        </td>
                                    </tr>
                                </table>
                            </div>

                            <p style="font-size: 13px; line-height: 1.6; color: #94a3b8;">
                                All external script widget pathways linked to <strong>${context.agentName}</strong> have been locked to secure your infrastructure against pipeline timeout crashes.
                            </p>

                            <div style="margin-top: 32px; text-align: center;">
                                <a href="http://localhost:5173/dashboard/subscription" target="_blank" style="display: inline-block; background-color: #7c3aed; color: #ffffff; font-weight: bold; font-size: 13px; text-decoration: none; padding: 12px 28px; border-radius: 10px; box-shadow: 0 10px 15px -3px rgba(124, 58, 237, 0.3); transition: all 0.2s;">
                                    Purchase Token Top-Up Pack
                                </a>
                            </div>
                        </div>

                        <div style="background-color: #060811; padding: 20px; border-top: 1px solid #1f2937; text-align: center; font-family: monospace; font-size: 10px; color: #4b5563;">
                            This is an automated operational telemetry update routed from AgentForge Server Core.
                        </div>
                    </div>
                </div>
            `,
        };

        const mailDeliveryReceipt = await transporter.sendMail(mailOptions);
        console.log(`[Telemetry Alert Dispatched]: System message routed to <${userEmail}>. Message ID: ${mailDeliveryReceipt.messageId}`);
        return true;

    } catch (emailError: any) {
        console.error(`[Telemetry Email Node Failure]: Failed to transmit support matrix log:`, emailError.message);
        return false;
    }
};