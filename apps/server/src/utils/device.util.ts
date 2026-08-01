import type { Request } from 'express';
import type { DeviceInfo } from '@careerhub/shared';

/**
 * Parses User-Agent header and extracts browser, OS, and device type info.
 */
export function parseDeviceInfo(req: Request): DeviceInfo {
  const ua = req.headers['user-agent'] ?? '';
  
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';
  let device = 'Unknown Device';
  let type: DeviceInfo['type'] = 'unknown';

  // Browser detection
  if (ua.includes('Firefox/')) {
    browser = 'Firefox';
  } else if (ua.includes('Edg/')) {
    browser = 'Edge';
  } else if (ua.includes('Chrome/')) {
    browser = 'Chrome';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    browser = 'Safari';
  } else if (ua.includes('OPR/') || ua.includes('Opera/')) {
    browser = 'Opera';
  }

  // OS detection
  if (ua.includes('Windows NT 10')) {
    os = 'Windows 10/11';
  } else if (ua.includes('Windows')) {
    os = 'Windows';
  } else if (ua.includes('Android')) {
    os = 'Android';
    type = 'mobile';
  } else if (ua.includes('iPhone') || ua.includes('iPad') || ua.includes('iPod')) {
    os = 'iOS';
    type = ua.includes('iPad') ? 'tablet' : 'mobile';
  } else if (ua.includes('Mac OS X')) {
    os = 'macOS';
    type = 'desktop';
  } else if (ua.includes('Linux')) {
    os = 'Linux';
    type = 'desktop';
  }

  // Device type override
  if (type === 'unknown') {
    if (/Mobi|Android|iPhone|iPod/i.test(ua)) {
      type = 'mobile';
    } else if (/iPad|Tablet/i.test(ua)) {
      type = 'tablet';
    } else if (ua.length > 0) {
      type = 'desktop';
    }
  }

  device = `${os} (${browser})`;

  return { browser, os, device, type };
}

/**
 * Extract client IP address taking proxies into account.
 */
export function getClientIp(req: Request): string {
  const forwardedFor = req.headers['x-forwarded-for'];
  if (typeof forwardedFor === 'string' && forwardedFor.length > 0) {
    return forwardedFor.split(',')[0]?.trim() ?? req.ip ?? '127.0.0.1';
  }
  return req.ip ?? req.socket.remoteAddress ?? '127.0.0.1';
}
