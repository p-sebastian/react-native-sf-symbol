// Copyright (c) 2026 Sebastian Peñafiel (@p-sebastian)
// SPDX-License-Identifier: MIT

import ExpoModulesCore
import SwiftUI

public final class ReactNativeSFSymbolView: ExpoView {
  let model = SFSymbolModel()
  private let hostingController: UIHostingController<SFSymbolContent>

  public required init(appContext: AppContext? = nil) {
    hostingController = UIHostingController(rootView: SFSymbolContent(model: model))
    super.init(appContext: appContext)

    let hostedView = hostingController.view!
    hostedView.backgroundColor = .clear
    hostedView.isUserInteractionEnabled = false
    hostedView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    addSubview(hostedView)
  }

  public override func layoutSubviews() {
    super.layoutSubviews()
    hostingController.view.frame = bounds
  }
}
